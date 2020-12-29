import { Test, TestingModule } from '@nestjs/testing';
import { StateController } from './state.controller';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from '../address/address.entity';
import { CityEntity } from '../address/city.entity';
import { StateEntity } from '../address/state.entity';
import { RequestEntity } from '../request/request.entity';
import { UserRepository } from '../auth/user.repository';
import { CityRepository } from '../address/city.repository';
import { StateRepository } from '../address/state.repository';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import supertest = require('supertest');
import { AddressRepository } from '../address/address.repository';
import { RequestRepository } from '../request/request.repository';
import { StateService } from './state.service';
import { OrderEntity } from '../order/order.entity';
import { OrderDetailEntity } from '../order/orderDetail.entity';
import { MaterialEntity } from '../material/material.entity';
import { getConnection } from 'typeorm';

describe('StateController', () => {
  let userRepo: UserRepository;
  let app: INestApplication;
  let stateRepo: StateRepository;
  let cityRepo: CityRepository;
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
      controllers: [StateController],
      providers: [StateService],
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
    stateRepo = await module.get<StateRepository>(StateRepository);
    cityRepo = await module.get<CityRepository>(CityRepository);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  afterEach(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });
  it('/state POST save new state', async () => {
    const city = await cityRepo.save({
      name: 'GORGAN',
    });
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/state')
      .send({ cityId: city.id, title: 'GORGANPARS' })
      .expect(201);
    expect(body).toEqual({
      state: {
        id: 1,
        title: 'GORGANPARS',
        city: {
          id: city.id,
          name: 'GORGAN',
        },
      },
    });
  });
  it('/state GET return all states', async () => {
    await cityRepo.save({
      name: 'GORGAN',
    });
    await stateRepo.save({
      title: 'GRSD',
      city: await cityRepo.findOne({ id: 1 }),
    });
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/state')
      .expect(200);
    expect(body).toEqual({
      states: [
        {
          id: 1,
          title: 'GRSD',
          city: { id: 1, name: 'GORGAN' },
        },
      ],
    });
  });
});
