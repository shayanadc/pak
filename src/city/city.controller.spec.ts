import { Test, TestingModule } from '@nestjs/testing';
import { CityController } from './city.controller';
import { UserRepository } from '../auth/user.repository';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { StateRepository } from '../address/state.repository';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from '../address/address.entity';
import { CityEntity } from '../address/city.entity';
import { StateEntity } from '../address/state.entity';
import { RequestEntity } from '../request/request.entity';
import { AddressRepository } from '../address/address.repository';
import { CityRepository } from '../address/city.repository';
import { RequestRepository } from '../request/request.repository';
import supertest = require('supertest');
import { CityService } from './city.service';
import { OrderDetailEntity } from '../order/orderDetail.entity';
import { OrderEntity } from '../order/order.entity';
import { MaterialEntity } from '../material/material.entity';
import { getConnection } from 'typeorm';
import { ProvinceEntity } from './province.entity';
import { ProvinceRepository } from './province.repository';
import { InvoiceEntity } from '../invoice/invoice.entity';
import { CareerEntity } from '../career/career.entity';

describe('CityController', () => {
  let userRepo: UserRepository;
  let app: INestApplication;
  let stateRepo: StateRepository;
  let cityRepo: CityRepository;
  let provinceRepo: ProvinceRepository;
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
            OrderDetailEntity,
            OrderEntity,
            MaterialEntity,
            ProvinceEntity,
            InvoiceEntity,
            CareerEntity,
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
          ProvinceRepository,
        ]),
      ],
      controllers: [CityController],
      providers: [CityService],
    })
      .overrideGuard(AuthGuard())
      .useValue({
        canActivate: async (context: ExecutionContext) => {
          const user = await userRepo.save({
            phone: '09129120912',
            code: '3t2vss',
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
    provinceRepo = await module.get<ProvinceRepository>(ProvinceRepository);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  afterEach(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });
  it('/city GET return all citiess', async () => {
    await provinceRepo.save({
      name: 'GOLESTAN',
    });
    await provinceRepo.save({
      name: 'MAZANDARAN',
    });
    await cityRepo.save({
      name: 'GORGAN',
      province: await provinceRepo.findOne({ id: 1 }),
    });
    await cityRepo.save({
      name: 'SARI',
      province: await provinceRepo.findOne({ id: 2 }),
    });
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/city?province=1')
      .expect(200);
    expect(body).toEqual({
      message: 'All Cities',
      cities: [
        {
          id: 1,
          name: 'GORGAN',
          province: {
            id: 1,
            name: 'GOLESTAN',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
    });
  });
});
