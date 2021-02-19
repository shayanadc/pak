import { Test, TestingModule } from '@nestjs/testing';
import { MaterialController } from './material.controller';
import supertest = require('supertest');
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { UserRepository } from '../auth/user.repository';
import { AddressRepository } from '../address/address.repository';
import { StateRepository } from '../address/state.repository';
import { RequestRepository } from '../request/request.repository';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from '../address/address.entity';
import { CityEntity } from '../address/city.entity';
import { StateEntity } from '../address/state.entity';
import { RequestEntity } from '../request/request.entity';
import { CityRepository } from '../address/city.repository';
import { MaterialRepository } from './material.repository';
import { MaterialEntity } from './material.entity';
import { MaterialService } from './material.service';
import { OrderDetailEntity } from '../order/orderDetail.entity';
import { OrderEntity } from '../order/order.entity';
import { getConnection } from 'typeorm';
import { ProvinceEntity } from '../city/province.entity';
import { InvoiceEntity } from '../invoice/invoice.entity';
import { CareerEntity } from '../career/career.entity';

describe('MaterialController', () => {
  let app: INestApplication;
  let userRepo: UserRepository;
  let materialRepo: MaterialRepository;
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
            OrderDetailEntity,
            OrderEntity,
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
          MaterialRepository,
        ]),
      ],
      controllers: [MaterialController],
      providers: [MaterialService],
    })
      .overrideGuard(AuthGuard())
      .useValue({
        canActivate: async (context: ExecutionContext) => {
          const user = await userRepo.save({
            phone: '09129120912',
            code: '15zf12',
          });
          const req = context.switchToHttp().getRequest();
          req.user = userRepo.findOne({ phone: '09129120912' }); // Your user object
          return true;
        },
      })
      .compile();
    userRepo = await module.get<UserRepository>(UserRepository);
    materialRepo = await module.get<MaterialRepository>(MaterialRepository);

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  afterEach(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });
  it('/material POST save new material', async () => {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/material')
      .send({ cost: 21015, title: 'PAPER' })
      .expect(201);
    expect(body).toEqual({
      message: 'new material has created',
      material: {
        id: 1,
        title: 'PAPER',
        cost: 21015,
        weight: 1,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });

  it('/material GET return all material', async () => {
    materialRepo.save({
      title: 'IRON',
      cost: 20000,
    });
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/material')
      .expect(200);
    expect(body).toEqual({
      message: 'All materials',
      materials: [
        {
          id: 1,
          title: 'IRON',
          cost: 20000,
          weight: 1,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
    });
  });

  it('/material/:id PUT update specific material', async () => {
    const mat = await materialRepo.save({
      title: 'IRON',
      cost: 20000,
    });
    const { body } = await supertest
      .agent(app.getHttpServer())
      .put('/material/1')
      .send({ cost: 1000 })
      .expect(200);
    expect(body).toStrictEqual({
      message: 'your material has changed',
      material: {
        id: mat.id,
        title: 'IRON',
        cost: 1000,
        weight: 1,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });
});
