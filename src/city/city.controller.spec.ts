import { Test, TestingModule } from '@nestjs/testing';
import { CityController } from './city.controller';
import { UserRepository } from '../auth/user.repository';
import { ExecutionContext, INestApplication } from '@nestjs/common';
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
import { StateController } from '../state/state.controller';
import { StateService } from '../state/state.service';
import supertest = require('supertest');
import { CityService } from './city.service';
import { OrderDetailEntity } from '../order/orderDetail.entity';
import { OrderEntity } from '../order/order.entity';
import { MaterialEntity } from '../material/material.entity';

describe('CityController', () => {
  let userRepo: UserRepository;
  let app: INestApplication;
  let stateRepo: StateRepository;
  let cityRepo: CityRepository;
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
            OrderDetailEntity,
            OrderEntity,
            MaterialEntity,
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
    app = module.createNestApplication();
    await app.init();
  });

  it('/city GET return all citiess', async () => {
    cityRepo.save({
      name: 'GORGAN',
    });
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/city')
      .expect(200);
    expect(body).toEqual({
      cities: [
        {
          id: 1,
          name: 'GORGAN',
        },
      ],
    });
  });
});
