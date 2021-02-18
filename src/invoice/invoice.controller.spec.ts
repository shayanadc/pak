import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { OrderRepository } from '../order/order.repository';
import { UserRepository } from '../auth/user.repository';
import { AddressRepository } from '../address/address.repository';
import { StateRepository } from '../address/state.repository';
import { RequestRepository } from '../request/request.repository';
import { MaterialRepository } from '../material/material.repository';
import { OrderDetailsRepository } from '../order/order.details.repository';
import { CityRepository } from '../address/city.repository';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from '../address/address.entity';
import { CityEntity } from '../address/city.entity';
import { StateEntity } from '../address/state.entity';
import { RequestEntity } from '../request/request.entity';
import { OrderEntity } from '../order/order.entity';
import { MaterialEntity } from '../material/material.entity';
import { OrderDetailEntity } from '../order/orderDetail.entity';
import { ProvinceEntity } from '../city/province.entity';
import { InvoiceEntity } from './invoice.entity';
import { OrderController } from '../order/order.controller';
import { OrderService } from '../order/order.service';
import { getConnection } from 'typeorm';
import supertest = require('supertest');
import exp from 'constants';
import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from './invoice.repository';

describe('InvoiceController', () => {
  let app: INestApplication;
  let orderRepository: OrderRepository;
  let userRepo: UserRepository;
  let addressRepo: AddressRepository;
  let stateRepository: StateRepository;
  let requestRepository: RequestRepository;
  let materialRepository: MaterialRepository;
  let orderDetailRepo: OrderDetailsRepository;
  let cityRepo: CityRepository;
  let invoiceRepo: InvoiceRepository;
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
          InvoiceRepository,
        ]),
      ],
      controllers: [InvoiceController],
      providers: [InvoiceService],
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
    invoiceRepo = await module.get<InvoiceRepository>(InvoiceRepository);

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });
  it('/invoice Post save new order ', async function() {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/invoice')
      .expect(201);
    expect(body).toEqual({
      message: 'create new invoice',
      invoice: {
        id: 1,
        amount: 9000,
        payback: false,
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
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      },
    });
    await supertest
      .agent(app.getHttpServer())
      .post('/invoice')
      .expect(400);
    expect((await invoiceRepo.find()).length).toEqual(1);
  });
});
