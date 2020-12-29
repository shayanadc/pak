import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from '../address/address.entity';
import { CityEntity } from '../address/city.entity';
import { StateEntity } from '../address/state.entity';
import { RequestEntity } from '../request/request.entity';
import { OrderEntity } from '../order/order.entity';
import { OrderDetailEntity } from '../order/orderDetail.entity';
import { MaterialEntity } from '../material/material.entity';
import { UserRepository } from '../auth/user.repository';
import { AddressRepository } from '../address/address.repository';
import { CityRepository } from '../address/city.repository';
import { StateRepository } from '../address/state.repository';
import { RequestRepository } from '../request/request.repository';
import { UserService } from './user.service';
import { getConnection } from 'typeorm';
import supertest = require('supertest');
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../role/roles.guard';

describe('UserController', () => {
  let app: INestApplication;
  let userRepo: UserRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: 'topSecret15',
          signOptions: {
            expiresIn: 3600,
          },
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [
            UserEntity,
            AddressEntity,
            CityEntity,
            StateEntity,
            RequestEntity,
            OrderEntity,
            OrderDetailEntity,
            MaterialEntity,
          ],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([
          UserRepository,
          AddressRepository,
          CityRepository,
          StateRepository,
          RequestRepository,
        ]),
      ],
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideGuard(AuthGuard())
      .useValue({
        canActivate: async (context: ExecutionContext) => {
          const user = await userRepo.save({
            phone: '09129120912',
          });
          const req = context.switchToHttp().getRequest();
          req.user = userRepo.findOne({ phone: '09129120912' }); // Your user object
          return true;
        },
      })
      .compile();
    userRepo = await module.get<UserRepository>(UserRepository);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });

  it('/user POST save new user', async () => {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/user')
      .send({
        phone: '09109100910',
        name: 'joe',
        lname: 'tribiani',
        disable: false,
      })
      .expect(201);
    expect(body).toEqual({
      user: {
        id: 2,
        phone: '09109100910',
        name: 'joe',
        lname: 'tribiani',
        disable: false,
        roles: ['admin'],
      },
    });
  });

  it('/user PUT change existed user attributes', async () => {
    const user = await userRepo.save({
      phone: '09109100910',
      name: 'joe',
      lname: 'terribiani',
      disable: false,
      roles: ['admin'],
    });
    const { body } = await supertest
      .agent(app.getHttpServer())
      .put('/user/2')
      .send({
        name: 'summerset',
        lname: 'muam',
        // disable: true,
      })
      .expect(200);
    expect(body).toEqual({
      user: {
        id: 2,
        name: 'summerset',
        lname: 'muam',
      },
    });
  });

  it('/user GET return all user with attributes filter', async () => {
    const user = await userRepo.save([
      {
        phone: '09109100910',
        name: 'jack',
        lname: 'sparraw',
        disable: true,
      },
      {
        phone: '09000000000',
        name: 'joe',
        lname: 'terribiani',
        disable: false,
      },
    ]);
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/user?phone=09109100910&disable=1')
      .expect(200);

    expect(body).toEqual({
      users: [
        {
          id: 1,
          phone: '09109100910',
          name: 'jack',
          lname: 'sparraw',
          disable: true,
          roles: ['admin'],
        },
      ],
    });
  });
});
