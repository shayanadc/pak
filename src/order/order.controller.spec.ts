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
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderEntity } from './order.entity';
import { MaterialEntity } from '../material/material.entity';
import { MaterialRepository } from '../material/material.repository';
import { OrderDetailEntity } from './orderDetailEntity';
import { OrderDetailsRepository } from './order.details.repository';

describe('OrderController', () => {
  let app: INestApplication;
  let orderRepository: OrderRepository;
  let userRepo: UserRepository;
  let addressRepo: AddressRepository;
  let stateRepository: StateRepository;
  let requestRepository: RequestRepository;
  let materialRepository: MaterialRepository;
  let orderDetailRepo: OrderDetailsRepository;

  beforeAll(async () => {
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
          await userRepo.save({
            phone: '09129120912',
          });
          const endUser = await userRepo.save({
            phone: '09109120912',
          });
          const state = await stateRepository.save({
            title: 'BLOCK',
          });

          const address = await addressRepo.save({
            description: 'Addresss.....',
            state: state,
            user: endUser,
          });

          await requestRepository.save({
            user: endUser,
            address: address,
            type: 1,
            date: '2000-01-01 00:00:00',
          });
          await materialRepository.save({
            title: 'Paper',
            cost: 20000,
          });
          await materialRepository.save({
            title: 'Iron',
            cost: 10000,
          });
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
    materialRepository = await module.get<MaterialRepository>(
      MaterialRepository,
    );
    orderDetailRepo = await module.get<OrderDetailsRepository>(
      OrderDetailsRepository,
    );

    app = module.createNestApplication();
    await app.init();
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
        id: 1,
        price: 70000,
        request: {
          id: 1,
          type: 1,
          work_shift: 1,
          date: '1999-12-31T20:30:00.000Z',
          period: null,
          done: true,
          user: {
            id: 2,
            phone: '09109120912',
          },
        },
        user: {
          id: 2,
          phone: '09109120912',
        },
        issuer: {
          id: 1,
          phone: '09129120912',
        },
        details: [
          { id: 1, price: 2 * 20000, weight: 2 },
          { id: 2, price: 3 * 10000, weight: 3 },
        ],
      },
    });
    expect((await orderDetailRepo.find()).length).toEqual(2);
    expect((await requestRepository.findOne({ id: 1 })).done).toBeTruthy();
  });
});
