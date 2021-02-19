import { Test, TestingModule } from '@nestjs/testing';
import { ProvinceController } from './province.controller';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ProvinceRepository } from '../city/province.repository';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { ProvinceEntity } from '../city/province.entity';
import { UserRepository } from '../auth/user.repository';
import { getConnection } from 'typeorm';
import supertest = require('supertest');
import { ProvinceService } from './province.service';
import { CityEntity } from '../address/city.entity';
import { StateEntity } from '../address/state.entity';
import { AddressEntity } from '../address/address.entity';
import { RequestEntity } from '../request/request.entity';
import { OrderEntity } from '../order/order.entity';
import { OrderDetailEntity } from '../order/orderDetail.entity';
import { MaterialEntity } from '../material/material.entity';
import { InvoiceEntity } from '../invoice/invoice.entity';
import { CareerEntity } from '../career/career.entity';

describe('ProvinceController', () => {
  let app: INestApplication;
  let provinceRepo: ProvinceRepository;
  let userRepo: UserRepository;
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
            ProvinceEntity,
            CityEntity,
            StateEntity,
            AddressEntity,
            UserEntity,
            RequestEntity,
            OrderEntity,
            OrderDetailEntity,
            MaterialEntity,
            InvoiceEntity,
            CareerEntity,
          ],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([ProvinceRepository]),
      ],
      controllers: [ProvinceController],
      providers: [ProvinceService],
    })
      // .overrideGuard(AuthGuard())
      // .useValue({
      //   canActivate: async (context: ExecutionContext) => {
      //     const user = await userRepo.save({
      //       phone: '09129120912',
      //     });
      //     const req = context.switchToHttp().getRequest();
      //     req.user = userRepo.findOne({ phone: '09129120912' }); // Your user object
      //     return true;
      //   },
      // })
      .compile();
    // userRepo = await module.get<UserRepository>(UserRepository);
    provinceRepo = await module.get<ProvinceRepository>(ProvinceRepository);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  afterEach(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });

  it('/province GET return all provinces', async () => {
    await provinceRepo.save([
      { name: 'MAZANDARAN' },
      {
        name: 'GOLESTAN',
      },
    ]);

    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/province')
      .expect(200);
    expect(body).toStrictEqual({
      message: 'All Provinces',
      provinces: [
        {
          id: 1,
          name: 'MAZANDARAN',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: 2,
          name: 'GOLESTAN',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
    });
  });
});
