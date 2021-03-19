import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { UserRepository } from '../auth/user.repository';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { StateRepository } from '../address/state.repository';
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
import { OrderDetailEntity } from '../order/orderDetail.entity';
import { MaterialEntity } from '../material/material.entity';
import { ProvinceEntity } from '../city/province.entity';
import { InvoiceEntity } from '../invoice/invoice.entity';
import { AddressRepository } from '../address/address.repository';
import { RequestRepository } from '../request/request.repository';
import { getConnection } from 'typeorm';
import { CommentRepository } from './comment.repository';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import supertest = require('supertest');
import { CareerEntity } from '../career/career.entity';

describe('MessageController', () => {
  let userRepo: UserRepository;
  let app: INestApplication;
  let messageRepo: CommentRepository;
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
            OrderDetailEntity,
            MaterialEntity,
            ProvinceEntity,
            InvoiceEntity,
            CommentEntity,
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
          CommentRepository,
        ]),
      ],
      controllers: [CommentController],
      providers: [CommentService],
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
    messageRepo = await module.get<CommentRepository>(CommentRepository);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  afterEach(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });
  it('/comment POST save message for auth user', async () => {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/comment')
      .send({
        subject: 'question',
        context: 'this is ...',
      })
      .expect(201);
    expect(body).toMatchObject({
      message: 'create new comment',
      comment: {
        id: 1,
        subject: 'question',
        context: 'this is ...',
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
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });
});
