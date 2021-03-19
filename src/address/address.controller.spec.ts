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
import { ProvinceEntity } from '../city/province.entity';
import { InvoiceEntity } from '../invoice/invoice.entity';
import { CareerEntity } from '../career/career.entity';
import { CareerRepository } from '../career/career.repository';
import { CommentEntity } from '../comments/comment.entity';

describe('AddressController', () => {
  let userRepo: UserRepository;
  let addressRepo: AddressRepository;
  let stateRepo: StateRepository;
  let cityRepo: CityRepository;
  let app: INestApplication;
  let authUser: UserEntity;
  let careerRepo: CareerRepository;
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
            ProvinceEntity,
            InvoiceEntity,
            CareerEntity,
            CommentEntity,
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
          CareerRepository,
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
            code: 'xyz123',
          });
          const city = await cityRepo.save({ name: 'GORGAN' });
          const state = await stateRepo.save({ title: 'BLOCK 24', city: city });
          const career = await careerRepo.save({
            title: 'OFFICE',
          });
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
    careerRepo = await module.get<CareerRepository>(CareerRepository);

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
    const user = await userRepo.save({ phone: '09109120912', code: '124tqw' });

    await addressRepo.save([{ description: 'Ave 245, Apt 215', user: user }]);
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/address')
      .expect(200);
    expect(body).toEqual({
      message: 'All Addresses',
      addresses: [
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
            states: [],
            gender: null,
            bankCardNo: null,
            birthDate: null,
            iban: null,
            nationalIdNumber: null,
            telphone: null,
            code: 'xyz123',
            agentId: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          state: {
            id: 1,
            title: 'BLOCK 24',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            city: {
              id: 1,
              name: 'GORGAN',
              province: null,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          },
          type: 2,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
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
            states: [],
            gender: null,
            code: 'xyz123',
            bankCardNo: null,
            birthDate: null,
            iban: null,
            nationalIdNumber: null,
            telphone: null,
            agentId: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          state: {
            id: 1,
            title: 'BLOCK 24',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            city: {
              id: 1,
              name: 'GORGAN',
              province: null,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          },
          type: 1,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
    });
  });
  it('/address POST create new address for auth user', async function() {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/address')
      .send({ description: 'Address ....', stateId: 1, type: 2, careerId: 1 })
      .expect(201);

    expect(body).toStrictEqual({
      message: 'New Address Has Created',
      address: {
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        id: 3,
        zipCode: null,
        description: 'Address ....',
        career: {
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          id: 1,
          title: 'OFFICE',
        },
        user: {
          id: 1,
          phone: '09129120912',
          name: null,
          lname: null,
          disable: false,
          roles: ['user'],
          states: [],
          gender: null,
          code: 'xyz123',
          bankCardNo: null,
          birthDate: null,
          iban: null,
          nationalIdNumber: null,
          telphone: null,
          agentId: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        state: {
          id: 1,
          title: 'BLOCK 24',
          city: {
            id: 1,
            name: 'GORGAN',
            province: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
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
