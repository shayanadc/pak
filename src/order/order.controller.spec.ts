import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import supertest = require('supertest');
import { OrderService } from './order.service';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from '../address/address.entity';
import { CityEntity } from '../address/city.entity';
import { StateEntity } from '../address/state.entity';
import { RequestEntity } from '../request/request.entity';
import { UserRepository } from '../auth/user.repository';
import { AddressRepository } from '../address/address.repository';
import { CityRepository } from '../address/city.repository';
import { StateRepository } from '../address/state.repository';
import { RequestRepository } from '../request/request.repository';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderEntity } from './order.entity';
import { MaterialEntity } from '../material/material.entity';
import { MaterialRepository } from '../material/material.repository';
import { OrderDetailEntity } from './orderDetail.entity';
import { OrderDetailsRepository } from './order.details.repository';
import { getConnection } from 'typeorm';

describe('OrderController', () => {
  let app: INestApplication;
  let orderRepository: OrderRepository;
  let userRepo: UserRepository;
  let addressRepo: AddressRepository;
  let stateRepository: StateRepository;
  let requestRepository: RequestRepository;
  let materialRepository: MaterialRepository;
  let orderDetailRepo: OrderDetailsRepository;
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
            MaterialEntity,
            OrderDetailEntity,
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
          OrderRepository,
          MaterialRepository,
          OrderDetailsRepository,
        ]),
      ],
      controllers: [OrderController],
      providers: [OrderService],
    })
      .overrideGuard(AuthGuard())
      .useValue({
        canActivate: async (context: ExecutionContext) => {
          const adminUser = await userRepo.save({
            phone: '09129120912',
          });
          const endUser = await userRepo.save({
            phone: '09109120912',
          });
          const city = await cityRepo.save({
            name: 'GORGAN',
          });
          const state = await stateRepository.save({
            title: 'BLOCK',
            city: await cityRepo.findOne({ id: city.id }),
          });
          const address = await addressRepo.save({
            description: 'Addresss.....',
            state: state,
            user: endUser,
          });
          await requestRepository.save({
            user: endUser,
            address: address,
            type: 3,
            date: '2000-01-01 00:00:00',
          });
          const request1 = await requestRepository.save({
            user: endUser,
            address: address,
            type: 1,
            date: '2000-01-01 00:00:00',
          });
          const request2 = await requestRepository.save({
            user: endUser,
            address: address,
            type: 2,
            date: '2000-01-01 00:00:00',
          });
          const mat1 = await materialRepository.save({
            title: 'Paper',
            cost: 20000,
          });
          const mat2 = await materialRepository.save({
            title: 'Iron',
            cost: 10000,
          });
          const detail1 = await orderDetailRepo.save([
            {
              material: mat1,
              weight: 2,
              price: 4000,
            },
            {
              material: mat2,
              weight: 3,
              price: 4000,
            },
          ]);
          const detail2 = await orderDetailRepo.save([
            {
              material: mat1,
              weight: 4,
              price: 1000,
            },
            {
              material: mat2,
              weight: 1,
              price: 1000,
            },
          ]);
          await orderRepository.save([
            {
              user: endUser,
              issuer: adminUser,
              request: request1,
              price: 4000,
              details: detail1,
            },
            {
              user: endUser,
              issuer: adminUser,
              request: request2,
              price: 9000,
              details: detail2,
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
    orderRepository = await module.get<OrderRepository>(OrderRepository);
    cityRepo = await module.get<CityRepository>(CityRepository);
    materialRepository = await module.get<MaterialRepository>(
      MaterialRepository,
    );
    orderDetailRepo = await module.get<OrderDetailsRepository>(
      OrderDetailsRepository,
    );

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });

  it('/order/aggregate return aggregate order', async function() {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/order/09129120912/aggregate')
      .expect(200);
    expect(body).toEqual({
      orders: [
        { materialId: 1, title: 'Paper', weight: 6 },
        { materialId: 2, title: 'Iron', weight: 4 },
      ],
    });
  });
  it('/order Post save new order ', async function() {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/order')
      .send({
        requestId: 1,
        rows: [
          { materialId: 1, weight: 2 },
          { materialId: 2, weight: 3 },
        ],
      })
      .expect(201);
    expect(body).toEqual({
      order: {
        id: 3,
        price: 70000,
        request: {
          id: 1,
          type: 3,
          work_shift: 1,
          date: '1999-12-31T20:30:00.000Z',
          period: null,
          done: true,
          user: {
            id: 2,
            phone: '09109120912',
            name: null,
            lname: null,
            disable: false,
            roles: ['user'],
          },
        },
        user: {
          id: 2,
          phone: '09109120912',
          name: null,
          lname: null,
          disable: false,
          roles: ['user'],
        },
        issuer: {
          id: 1,
          phone: '09129120912',
          name: null,
          lname: null,
          disable: false,
          roles: ['user'],
        },
        details: [
          {
            id: 5,
            price: 2 * 20000,
            weight: 2,
            material: { cost: 20000, id: 1, title: 'Paper', weight: 1 },
          },
          {
            id: 6,
            price: 3 * 10000,
            weight: 3,
            material: { cost: 10000, id: 2, title: 'Iron', weight: 1 },
          },
        ],
      },
    });
    expect((await orderDetailRepo.find()).length).toEqual(6);
    expect((await requestRepository.findOne({ id: 1 })).done).toBeTruthy();
  });
});
