import supertest = require('supertest');
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { Connection, getConnection } from 'typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthCredentialDTO } from './authCredential.dto';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { UserEntity } from './user.entity';
import { AddressEntity } from '../address/address.entity';
import { CityRepository } from '../address/city.repository';
import { CityEntity } from '../address/city.entity';
import { StateEntity } from '../address/state.entity';
import { AddressRepository } from '../address/address.repository';
import { StateRepository } from '../address/state.repository';
import SmsInterface from './sms.interface';
import CodeGenerator from './code-generator';
import CacheInterface from './cache.interface';
import { RequestRepository } from '../request/request.repository';
import { RequestEntity } from '../request/request.entity';
import { OrderEntity } from '../order/order.entity';
import { OrderDetailEntity } from '../order/orderDetail.entity';
import { MaterialRepository } from '../material/material.repository';
import { OrderDetailsRepository } from '../order/order.details.repository';
import { OrderRepository } from '../order/order.repository';
import { MaterialEntity } from '../material/material.entity';
import { OrderService } from '../order/order.service';
import { ProvinceEntity } from '../city/province.entity';
import { InvoiceEntity } from '../invoice/invoice.entity';
import { RequestService } from '../request/request.service';
import { CareerEntity } from '../career/career.entity';
import { CommentEntity } from '../comments/comment.entity';

describe('Create And Toke User API', () => {
  let app: INestApplication;
  let userRepo: UserRepository;
  let smsService: SmsInterface;
  let cacheService: CacheInterface;
  let addressRepo: AddressRepository;
  let stateRepository: StateRepository;
  let requestRepository: RequestRepository;
  let materialRepository: MaterialRepository;
  let orderDetailRepo: OrderDetailsRepository;
  let orderRepo: OrderRepository;
  const smsProvider = {
    provide: 'SmsInterface',
    useFactory: () => ({
      sendMessage: jest.fn(),
    }),
  };
  const cacheProvider = {
    provide: 'CacheInterface',
    useFactory: () => ({
      set: jest.fn(),
      get: jest.fn().mockReturnValue('12345'),
    }),
  };
  const identifyCode = {
    provide: 'IdentifyCodeInterface',
    useFactory: () => ({
      generate: jest
        .fn()
        .mockReturnValueOnce('xyz123')
        .mockReturnValueOnce('123tqw'),
    }),
  };
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
          OrderDetailsRepository,
          MaterialRepository,
        ]),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        smsProvider,
        cacheProvider,
        identifyCode,
        CodeGenerator,
        OrderService,
        RequestService,
      ],
    })
      .overrideGuard(AuthGuard())
      .useValue({
        canActivate: async (context: ExecutionContext) => {
          const state = await stateRepository.save({
            title: 'BLOCK',
          });

          const user = await userRepo.save({
            phone: '09129120912',
            states: [state],
            code: '125gas',
          });

          const address = await addressRepo.save({
            description: 'Addresss.....',
            state: state,
            user: user,
          });

          const request1 = await requestRepository.save({
            user: user,
            address: address,
            type: 1,
            date: '2000-01-01 00:00:00',
            done: true,
          });
          const request2 = await requestRepository.save({
            user: user,
            address: address,
            type: 2,
            date: '2000-01-01 00:00:00',
            done: true,
          });
          const mat = await materialRepository.save([
            {
              title: 'Paper',
              cost: 2000,
            },
            {
              title: 'Iron',
              cost: 3000,
            },
          ]);
          const detail1 = await orderDetailRepo.save({
            material: mat[0],
            weight: 2,
            price: 4000,
          });
          const detail2 = await orderDetailRepo.save({
            material: mat[1],
            weight: 3,
            price: 9000,
          });
          await orderRepo.save([
            { user: user, request: request1, price: 4000, details: [detail1] },
            { user: user, request: request2, price: 9000, details: [detail2] },
          ]);

          const req = context.switchToHttp().getRequest();
          req.user = await userRepo.findOne({ phone: '09129120912' }); // Your user object
          return true;
        },
      })
      .compile();
    userRepo = await module.get<UserRepository>(UserRepository);
    stateRepository = await module.get<StateRepository>(StateRepository);
    addressRepo = await module.get<AddressRepository>(AddressRepository);
    requestRepository = await module.get<RequestRepository>(RequestRepository);
    orderRepo = await module.get<OrderRepository>(OrderRepository);
    orderDetailRepo = await module.get<OrderDetailsRepository>(
      OrderDetailsRepository,
    );
    materialRepository = await module.get<MaterialRepository>(
      MaterialRepository,
    );
    // connection = module.get(Connection);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });

  it('auth/token POST Create New Token', async () => {
    JwtService.prototype.sign = jest
      .fn()
      .mockReturnValue('@1a$A4@SHS5af151ag60kagJAgaaAKjAK1');
    await userRepo.save([
      {
        phone: '09129120912',
        code: '125jfh',
      },
    ]);
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/auth/token')
      .send({
        phone: '09129120912',
        activation_code: '12345',
      } as AuthCredentialDTO)
      .expect(201);
    expect(body).toEqual({
      message: 'return access token',
      accessToken: '@1a$A4@SHS5af151ag60kagJAgaaAKjAK1',
    });
    expect(JwtService.prototype.sign).toHaveBeenCalledTimes(1);
  });

  it('/auth/token POST invalid request', async function() {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/auth/token')
      .send({ phone: 1245, activation_code: 12445 })
      .expect(400);
    expect(body).toMatchObject({
      statusCode: 400,
      message: ['phone must be a string', 'activation_code must be a string'],
    });
  });

  it('/auth/login POST return created user with specific phone number', async function() {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({ phone: '09129120912' })
      .expect(201);
    expect(body).toEqual({
      message: 'the activation code sent for your customer',
      newUser: true,
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
        code: 'xyz123',
        nationalIdNumber: null,
        telphone: null,
        agentId: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });

  it('/auth/user return authenticated user', async () => {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/auth/user')
      .expect(200);
    expect(body).toEqual({
      message: 'current user',
      user: {
        id: 1,
        phone: '09129120912',
        name: null,
        lname: null,
        disable: false,
        roles: ['user'],
        gender: null,
        bankCardNo: null,
        birthDate: null,
        iban: null,
        code: '125gas',
        nationalIdNumber: null,
        telphone: null,
        agentId: null,
        states: [
          {
            city: null,
            createdAt: expect.any(String),
            id: 1,
            title: 'BLOCK',
            qty: 0,
            updatedAt: expect.any(String),
          },
        ],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      credit: {
        total: { amount: 13000, quantity: 2 },
      },
    });
  });
});
