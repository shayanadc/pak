import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../auth/user.repository';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressRepository } from './address.repository';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from './address.entity';
import { StateRepository } from './state.repository';
import { StateEntity } from './state.entity';
import { CityEntity } from './city.entity';
import { CityRepository } from './city.repository';
import { RequestRepository } from '../request/request.repository';
import { RequestEntity } from '../request/request.entity';
import supertest = require('supertest');
import { OrderEntity } from '../order/order.entity';
import { OrderDetailEntity } from '../order/orderDetail.entity';
import { MaterialEntity } from '../material/material.entity';
import { getConnection } from 'typeorm';

describe('AddressController', () => {
  let userRepo: UserRepository;
  let addressRepo: AddressRepository;
  let stateRepo: StateRepository;
  let cityRepo: CityRepository;
  let app: INestApplication;
  let authUser: UserEntity;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserRepository,
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
            StateEntity,
            CityEntity,
            RequestEntity,
            MaterialEntity,
            OrderEntity,
            OrderDetailEntity,
          ],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([
          AddressRepository,
          UserRepository,
          StateRepository,
          CityRepository,
          RequestRepository,
        ]),
      ],
      controllers: [AddressController],
      providers: [AddressService],
    })
      .overrideGuard(AuthGuard())
      .useValue({
        canActivate: async (context: ExecutionContext) => {
          authUser = await userRepo.save({
            phone: '09129120912',
          });
          const city = await cityRepo.save({ name: 'GORGAN' });
          const state = await stateRepo.save({ title: 'BLOCK 24', city: city });
          await addressRepo.save([
            {
              description: 'BLAH BLAH',
              user: authUser,
              state: state,
              type: 1,
            },
            {
              description: 'HALAN HALAM',
              user: authUser,
              state: state,
              type: 2,
            },
          ]);
          const req = await context.switchToHttp().getRequest();
          req.user = await userRepo.findOne({ phone: '09129120912' }); // Your user object
          return true;
        },
      })
      .compile();
    userRepo = await module.get<UserRepository>(UserRepository);
    addressRepo = await module.get<AddressRepository>(AddressRepository);
    stateRepo = await module.get<StateRepository>(StateRepository);
    cityRepo = await module.get<CityRepository>(CityRepository);

    // connection = module.get(Connection);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  afterEach(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });

  it('/address GET return addresses of auth user', async function() {
    const user = await userRepo.save({ phone: '09109120912' });

    await addressRepo.save([{ description: 'Ave 245, Apt 215', user: user }]);
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/address')
      .expect(200);
    expect(body).toEqual({
      message: 'All Addresses',
      addresses: [
        {
          zipCode: null,
          id: 2,
          description: 'BLAH BLAH',
          user: {
            id: 2,
            phone: '09129120912',
            name: null,
            lname: null,
            disable: false,
            roles: ['user'],
          },
          state: { id: 1, title: 'BLOCK 24', city: { id: 1, name: 'GORGAN' } },
          type: 1,
        },
        {
          id: 3,
          zipCode: null,
          description: 'HALAN HALAM',
          user: {
            id: 2,
            phone: '09129120912',
            name: null,
            lname: null,
            disable: false,
            roles: ['user'],
          },
          state: { id: 1, title: 'BLOCK 24', city: { id: 1, name: 'GORGAN' } },
          type: 2,
        },
      ],
    });
  });
  it('/address POST create new address for auth user', async function() {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/address')
      .send({ description: 'Address ....', stateId: 1, type: 2 })
      .expect(201);

    expect(body).toStrictEqual({
      message: 'New Address Has Created',
      address: {
        id: 3,
        zipCode: null,
        description: 'Address ....',
        user: {
          id: 1,
          phone: '09129120912',
          name: null,
          lname: null,
          disable: false,
          roles: ['user'],
        },
        state: { id: 1, title: 'BLOCK 24', city: { id: 1, name: 'GORGAN' } },
        type: 2,
      },
    });
  });

  it('/address/:id DELETE delete specific request of usser', async () => {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .delete('/address/1')
      .expect(200);
  });
});
