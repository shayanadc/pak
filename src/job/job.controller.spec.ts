import { Test, TestingModule } from '@nestjs/testing';
import { JobController } from './job.controller';
import { UserRepository } from '../auth/user.repository';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { StateRepository } from '../address/state.repository';
import { CityRepository } from '../address/city.repository';
import { ProvinceRepository } from '../city/province.repository';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from '../address/address.entity';
import { CityEntity } from '../address/city.entity';
import { StateEntity } from '../address/state.entity';
import { RequestEntity } from '../request/request.entity';
import { OrderDetailEntity } from '../order/orderDetail.entity';
import { OrderEntity } from '../order/order.entity';
import { MaterialEntity } from '../material/material.entity';
import { ProvinceEntity } from '../city/province.entity';
import { InvoiceEntity } from '../invoice/invoice.entity';
import { AddressRepository } from '../address/address.repository';
import { RequestRepository } from '../request/request.repository';
import { CityController } from '../city/city.controller';
import { CityService } from '../city/city.service';
import { getConnection } from 'typeorm';
import { JobService } from './job.service';
import supertest = require('supertest');
import { JobRepository } from './job.repository';
import { JobEntity } from './job.entity';

describe('JOB Controller', () => {
  let userRepo: UserRepository;
  let app: INestApplication;
  let jobRepo: JobRepository;
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
            JobEntity,
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
          JobRepository,
        ]),
      ],
      controllers: [JobController],
      providers: [JobService],
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
    jobRepo = await module.get<JobRepository>(JobRepository);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  afterEach(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });

  it('/job GET return all jobs', async () => {
    await jobRepo.save({
      title: 'DR',
    });
    await jobRepo.save({
      title: 'MANUFACTOR',
    });
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/job')
      .expect(200);
    expect(body).toEqual({
      message: 'All Jobs',
      jobs: [
        {
          id: 1,
          title: 'DR',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: 2,
          title: 'MANUFACTOR',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
    });
  });
});
