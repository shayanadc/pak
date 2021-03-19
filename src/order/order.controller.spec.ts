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
import { ProvinceEntity } from '../city/province.entity';
import { InvoiceEntity } from '../invoice/invoice.entity';
import { RequestService } from '../request/request.service';
import { CareerEntity } from '../career/career.entity';
import { CommentEntity } from '../comments/comment.entity';

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
            ProvinceEntity,
            InvoiceEntity,
            CareerEntity,
            CommentEntity,
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
      providers: [OrderService, RequestService],
    })
      .overrideGuard(AuthGuard())
      .useValue({
        canActivate: async (context: ExecutionContext) => {
          const adminUser = await userRepo.save({
            phone: '09129120912',
            code: '215gss',
          });
          const endUser = await userRepo.save({
            phone: '09109120912',
            code: '215gs1',
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
          await requestRepository.save({
            user: endUser,
            address: address,
            type: 1,
            done: true,
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
          const request3 = await requestRepository.save({
            user: adminUser,
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

          const detail3 = await orderDetailRepo.save([
            {
              material: mat1,
              weight: 4,
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
            {
              user: adminUser,
              issuer: endUser,
              request: request3,
              price: 9000,
              details: detail3,
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
  it('/order/delivered return aggregate order', async function() {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .put('/order/09129120912/delivered')
      .expect(200);
    expect(
      (await orderRepository.find({ where: { delivered: true } })).length,
    ).toEqual(2);
  });
  // it('/order/invoice ready orders for this user to settle', async function() {
  //   const { body } = await supertest
  //     .agent(app.getHttpServer())
  //     .put('/order/invoice')
  //     .expect(200);
  //   expect(
  //     (
  //       await orderRepository.find({
  //         where: { invoice: true },
  //       })
  //     ).length,
  //   ).toEqual(1);
  // });

  // it('/order/invoice/user ready orders for this user to settle', async function() {
  //   const { body } = await supertest
  //     .agent(app.getHttpServer())
  //     .get('/order/invoice/users')
  //     .expect(200);
  // });

  it('/order/all ready orders for this user to settle', async function() {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/order/all')
      .expect(200);
    expect(body).toEqual({
      message: 'return all orders',
      orders: [
        {
          id: 1,
          price: 4000,
          delivered: false,
          donate: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          user: {
            id: 2,
            phone: '09109120912',
            name: null,
            lname: null,
            disable: false,
            roles: ['user'],
            states: [],
            gender: null,
            bankCardNo: null,
            birthDate: null,
            iban: null,
            nationalIdNumber: null,
            telphone: null,
            code: expect.any(String),
            agentId: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          issuer: {
            id: 1,
            phone: '09129120912',
            name: null,
            lname: null,
            disable: false,
            roles: ['user'],
            states: [],
            gender: null,
            bankCardNo: null,
            birthDate: null,
            iban: null,
            nationalIdNumber: null,
            telphone: null,
            agentId: null,
            code: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        },
        {
          id: 2,
          price: 9000,
          delivered: false,
          donate: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          user: {
            id: 2,
            phone: '09109120912',
            name: null,
            lname: null,
            disable: false,
            roles: ['user'],
            states: [],
            gender: null,
            bankCardNo: null,
            birthDate: null,
            iban: null,
            nationalIdNumber: null,
            telphone: null,
            agentId: null,
            code: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          issuer: {
            id: 1,
            phone: '09129120912',
            name: null,
            lname: null,
            disable: false,
            roles: ['user'],
            states: [],
            gender: null,
            bankCardNo: null,
            birthDate: null,
            iban: null,
            nationalIdNumber: null,
            telphone: null,
            agentId: null,
            code: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        },
        {
          id: 3,
          price: 9000,
          delivered: false,
          donate: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          user: {
            id: 1,
            phone: '09129120912',
            name: null,
            lname: null,
            disable: false,
            roles: ['user'],
            states: [],
            gender: null,
            bankCardNo: null,
            birthDate: null,
            iban: null,
            nationalIdNumber: null,
            telphone: null,
            code: expect.any(String),
            agentId: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          issuer: {
            id: 2,
            phone: '09109120912',
            name: null,
            lname: null,
            disable: false,
            roles: ['user'],
            states: [],
            gender: null,
            bankCardNo: null,
            birthDate: null,
            iban: null,
            nationalIdNumber: null,
            telphone: null,
            agentId: null,
            code: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        },
      ],
    });
  });
  it('/order/collected return aggregate order', async function() {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/order/aggregate?delivered=0')
      .expect(200);
    expect(body).toEqual({
      message: 'all of order report for this user ',
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
        // donate: true,
        rows: [
          { materialId: 1, weight: 2 },
          { materialId: 2, weight: 3 },
        ],
      })
      .expect(201);
    expect(body).toEqual({
      message: 'create new order',
      order: {
        id: 4,
        price: 70000,
        delivered: false,
        donate: false,
        request: {
          id: 1,
          type: 3,
          work_shift: 1,
          date: '1999-12-31T20:30:00.000Z',
          period: null,
          suspended: 0,
          done: true,
          address: {
            createdAt: expect.any(String),
            description: 'Addresss.....',
            id: 1,
            state: {
              city: {
                createdAt: expect.any(String),
                id: 1,
                name: 'GORGAN',
                province: null,
                updatedAt: expect.any(String),
              },
              createdAt: expect.any(String),
              id: 1,
              title: 'BLOCK',
              updatedAt: expect.any(String),
            },
            type: 1,
            updatedAt: expect.any(String),
            zipCode: null,
          },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          user: {
            id: 2,
            phone: '09109120912',
            name: null,
            lname: null,
            disable: false,
            roles: ['user'],
            states: [],
            gender: null,
            bankCardNo: null,
            birthDate: null,
            iban: null,
            nationalIdNumber: null,
            telphone: null,
            agentId: null,
            code: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        },
        user: {
          id: 2,
          phone: '09109120912',
          name: null,
          lname: null,
          disable: false,
          roles: ['user'],
          states: [],
          gender: null,
          bankCardNo: null,
          birthDate: null,
          iban: null,
          nationalIdNumber: null,
          telphone: null,
          agentId: null,
          code: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        issuer: {
          id: 1,
          phone: '09129120912',
          name: null,
          lname: null,
          disable: false,
          roles: ['user'],
          states: [],
          gender: null,
          bankCardNo: null,
          birthDate: null,
          iban: null,
          nationalIdNumber: null,
          telphone: null,
          agentId: null,
          code: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        details: [
          {
            id: 6,
            price: 4 * 10000,
            weight: 2,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            material: {
              cost: 20000,
              id: 1,
              title: 'Paper',
              weight: 1,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          },
          {
            id: 7,
            price: 30000,
            weight: 3,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            material: {
              cost: 10000,
              id: 2,
              title: 'Iron',
              weight: 1,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          },
        ],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
    expect((await orderDetailRepo.find()).length).toEqual(7);
    expect((await requestRepository.findOne({ id: 1 })).done).toBeTruthy();
  });
  it('/order Post prevent save new order for non existing orders', async function() {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/order')
      .send({
        requestId: 10,
        rows: [
          { materialId: 1, weight: 2 },
          { materialId: 2, weight: 3 },
        ],
      })
      .expect(400);
  });

  it('/order Post prevent save new order for done orders', async function() {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/order')
      .send({
        requestId: 2,
        rows: [
          { materialId: 1, weight: 2 },
          { materialId: 2, weight: 3 },
        ],
      })
      .expect(400);
    expect(body).toMatchObject({
      statusCode: 400,
      message: ['Could not create order for done or box request'],
    });
  });
});
