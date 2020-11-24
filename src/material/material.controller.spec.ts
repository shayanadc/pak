import { Test, TestingModule } from '@nestjs/testing';
import { MaterialController } from './material.controller';
import supertest = require('supertest');
import { ExecutionContext, INestApplication } from '@nestjs/common';
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

describe('MaterialController', () => {
  let app: INestApplication;
  let userRepo: UserRepository;
  let materialRepo: MaterialRepository;
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
    await app.init();
  });

  afterEach(async () => {
    await userRepo.query(`DELETE FROM users;`);
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
      materials: [
        {
          id: 1,
          title: 'IRON',
          cost: 20000,
          weight: 1,
        },
      ],
    });
  });
});
