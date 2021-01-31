import { Test, TestingModule } from '@nestjs/testing';
import { RequestController } from './request.controller';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { UserRepository } from '../auth/user.repository';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from '../address/address.entity';
import { CityEntity } from '../address/city.entity';
import { StateEntity } from '../address/state.entity';
import { AddressRepository } from '../address/address.repository';
import { CityRepository } from '../address/city.repository';
import { StateRepository } from '../address/state.repository';

import supertest = require('supertest');
import { RequestService } from './request.service';
import { RequestEntity } from './request.entity';
import { RequestRepository } from './request.repository';
import { OrderEntity } from '../order/order.entity';
import { OrderDetailEntity } from '../order/orderDetail.entity';
import { MaterialEntity } from '../material/material.entity';
import { MaterialRepository } from '../material/material.repository';
import { getConnection } from 'typeorm';
import { ProvinceEntity } from '../city/province.entity';
import { InvoiceEntity } from '../invoice/invoice.entity';

describe('Request Controller', () => {
  let app: INestApplication;
  let userRepo: UserRepository;
  let addressRepo: AddressRepository;
  let stateRepository: StateRepository;
  let requestRepository: RequestRepository;
  let cityRepo: CityRepository;

  // let connection : Connection
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
            MaterialEntity,
            OrderEntity,
            OrderDetailEntity,
            ProvinceEntity,
            InvoiceEntity,
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
          MaterialRepository,
        ]),
      ],
      controllers: [RequestController],
      providers: [RequestService],
    })
      .overrideGuard(AuthGuard())
      .useValue({
        canActivate: async (context: ExecutionContext) => {
          const user = await userRepo.save({
            phone: '09129120912',
          });
          const user2 = await userRepo.save({
            phone: '09199120912',
          });
          await cityRepo.save({
            name: 'GORG',
          });
          const city = await cityRepo.findOne({ name: 'GORG' });
          await stateRepository.save({
            title: 'BLOCK',
            city: await cityRepo.findOne({ id: city.id }),
          });
          const state = await stateRepository.findOne({ id: 1 });
          const address = await addressRepo.save({
            description: 'Addresss.....',
            state: state,
            user: user,
          });

          await requestRepository.save([
            {
              user: user,
              address: address,
              type: 1,
              date: '1999-12-31T20:30:00.000Z',
            },
            {
              user: user2,
              address: address,
              type: 3,
              date: '2020-12-31T20:30:00.000Z',
            },
          ]);
          const req = context.switchToHttp().getRequest();
          req.user = userRepo.findOne({ phone: '09129120912' }); // Your user object
          return true;
        },
      })
      .compile();
    userRepo = await module.get<UserRepository>(UserRepository);
    addressRepo = await module.get<AddressRepository>(AddressRepository);
    stateRepository = await module.get<StateRepository>(StateRepository);
    requestRepository = await module.get<RequestRepository>(RequestRepository);
    cityRepo = await module.get<CityRepository>(CityRepository);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });

  it('/request POST save user request', async () => {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/request')
      .send({
        addressId: 1,
        type: 2,
        date: '2019-09-03T00:00:00.000Z',
        work_shift: 2,
      })
      .expect(201);
    expect(body).toEqual({
      message: 'new request created',
      request: {
        id: 3,
        user: {
          id: 1,
          phone: '09129120912',
          name: null,
          lname: null,
          disable: false,
          roles: ['user'],
          states: [],
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        address: {
          id: 1,
          zipCode: null,
          description: 'Addresss.....',
          type: 1,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          state: {
            id: 1,
            title: 'BLOCK',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            city: {
              id: 1,
              name: 'GORG',
              province: null,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          },
        },
        type: 2,
        work_shift: 2,
        date: '2019-09-03T00:00:00.000Z',
        period: null,
        done: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });
  it('/request POST prevent saving duplicate request to save box request for specific address', async () => {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/request')
      .send({
        addressId: 1,
        type: 1,
        date: '1999-12-31T20:30:00.000Z',
        work_shift: 1,
      })
      .expect(400);
  });
  it('/request POST prevent user to save periodic request with deteriminig day', async () => {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/request')
      .send({
        addressId: 1,
        type: 3,
        date: '1999-12-31T20:30:00.000Z',
        work_shift: 1,
      })
      .expect(400);
  });

  it('/request GET return requests of user', async () => {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/request')
      .expect(200);
    expect(body).toEqual({
      message: 'all request',
      requests: [
        {
          id: 1,
          type: 1,
          user: {
            id: 1,
            phone: '09129120912',
            name: null,
            lname: null,
            disable: false,
            roles: ['user'],
            states: [],
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          address: {
            id: 1,
            zipCode: null,
            type: 1,
            description: 'Addresss.....',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            state: {
              id: 1,
              title: 'BLOCK',
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              city: {
                id: 1,
                name: 'GORG',
                province: null,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
            },
          },
          date: '1999-12-31T20:30:00.000Z',
          period: null,
          work_shift: 1,
          done: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
    });
  });

  it('/request GET return all requests for driver', async () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2002-02-22T10:30:00.000Z').getTime());
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/request/waiting?states=1,2&work_shift=1')
      .expect(200);
    expect(body).toEqual({
      message: 'return all index',
      requests: [
        {
          id: 1,
          type: 1,
          user: {
            id: 1,
            phone: '09129120912',
            name: null,
            lname: null,
            disable: false,
            roles: ['user'],
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          date: '1999-12-31T20:30:00.000Z',
          address: {
            type: 1,
            zipCode: null,
            description: 'Addresss.....',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: 1,
            state: {
              // city: {
              //   id: 1,
              //   name: 'GORG',
              //   province: null,
              //   createdAt: expect.any(String),
              //   updatedAt: expect.any(String),
              // },
              id: 1,
              title: 'BLOCK',
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          },
          period: null,
          work_shift: 1,
          done: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
    });
  });

  it('/request PUT change state of box request', async () => {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .put('/request/1/process')
      .expect(200);
    expect(body).toEqual({
      message: 'request processed',
      request: {
        id: 1,
        user: {
          id: 1,
          phone: '09129120912',
          name: null,
          lname: null,
          disable: false,
          roles: ['user'],
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        address: {
          id: 1,
          zipCode: null,
          description: 'Addresss.....',
          type: 1,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          state: {
            id: 1,
            title: 'BLOCK',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            city: {
              id: 1,
              name: 'GORG',
              province: null,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          },
        },
        type: 1,
        work_shift: 1,
        date: '1999-12-31T20:30:00.000Z',
        period: null,
        done: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });

  it('/request/:id DELETE delete specific request of user', async () => {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .delete('/request/1')
      .expect(200);
  });
});
