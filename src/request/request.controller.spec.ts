import { Test, TestingModule } from '@nestjs/testing';
import { RequestController } from './request.controller';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { UserRepository } from '../auth/user.repository';
import SmsInterface from '../auth/sms.interface';
import CacheInterface from '../auth/cache.interface';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from '../address/address.entity';
import { CityEntity } from '../address/city.entity';
import { StateEntity } from '../address/state.entity';
import { AddressRepository } from '../address/address.repository';
import { CityRepository } from '../address/city.repository';
import { StateRepository } from '../address/state.repository';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import CodeGenerator from '../auth/code-generator';
import supertest = require('supertest');
import { AddressController } from '../address/address.controller';
import { RequestService } from './request.service';
import { RequestEntity } from './request.entity';
import { RequestRepository } from './request.repository';

describe('Request Controller', () => {
  let app: INestApplication;
  let userRepo: UserRepository;
  let addressRepo: AddressRepository;
  let stateRepository: StateRepository;
  let requestRepository: RequestRepository;

  // let connection : Connection
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
      controllers: [RequestController],
      providers: [RequestService],
    })
      .overrideGuard(AuthGuard())
      .useValue({
        canActivate: async (context: ExecutionContext) => {
          const user = await userRepo.save({
            phone: '09129120912',
          });
          const state = await stateRepository.save({
            title: 'BLOCK',
          });

          const address = await addressRepo.save({
            description: 'Addresss.....',
            state: state,
            user: user,
          });

          await requestRepository.save({
            user: user,
            address: address,
            type: 1,
            date: '2000-01-01 00:00:00',
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

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await requestRepository.query(`DELETE FROM requests;`);
    await addressRepo.query(`DELETE FROM addresses;`);
    await stateRepository.query(`DELETE FROM states;`);
    await userRepo.query(`DELETE FROM users;`);
  });
  it('/request POST save user request', async () => {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/request')
      .send({ addressId: 1, type: 1, date: '2000-01-01 00:03:00' })
      .expect(201);
    expect(body).toEqual({
      request: {
        id: 2,
        user: { id: 1, phone: '09129120912' },
        address: { id: 1, description: 'Addresss.....' },
        type: 1,
        date: '2000-01-01 00:03:00',
      },
    });
  });
  it('/request GET return requests of user', async () => {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/request')
      .expect(200);
    expect(body).toEqual({
      requests: [
        {
          date: '1999-12-31T20:30:00.000Z',
          id: 1,
          type: 1,
          user: { id: 1, phone: '09129120912' },
        },
      ],
    });
  });
  it('/request/:id DELETE delete specific request of user', async () => {
    const { body } = await supertest
      .agent(app.getHttpServer())
      .delete('/request/1')
      .expect(200);
  });
});
