import { Test, TestingModule } from '@nestjs/testing';
import { StateController } from './state.controller';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from '../address/address.entity';
import { CityEntity } from '../address/city.entity';
import { StateEntity } from '../address/state.entity';
import { RequestEntity } from '../request/request.entity';
import { UserRepository } from '../auth/user.repository';
import { CityRepository } from '../address/city.repository';
import { StateRepository } from '../address/state.repository';
import { RequestController } from '../request/request.controller';
import { RequestService } from '../request/request.service';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import supertest = require('supertest');
import { AddressRepository } from '../address/address.repository';
import { RequestRepository } from '../request/request.repository';
import { StateService } from './state.service';
import { OrderEntity } from '../order/order.entity';
import { OrderDetailEntity } from '../order/orderDetailEntity';

describe('StateController', () => {
  let userRepo: UserRepository;
  let app: INestApplication;
  let stateRepo: StateRepository;
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
        ]),
      ],
      controllers: [StateController],
      providers: [StateService],
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
    app = module.createNestApplication();
    await app.init();
  });
  it('/request GET return all states', async () => {
    stateRepo.save({
      title: 'GRSD',
    });
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/state')
      .expect(200);
    expect(body).toEqual({
      states: [
        {
          id: 1,
          title: 'GRSD',
        },
      ],
    });
  });
});
