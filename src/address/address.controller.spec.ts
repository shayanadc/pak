import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../auth/user.repository';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import supertest = require('supertest');
import { AddressService } from './address.service';
import { AddressRepository } from './address.repository';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from './address.entity';
import { StateRepository } from './state.repository';
import { StateEntity } from './state.entity';

describe('AddressController', () => {
  let userRepo: UserRepository;
  let addressRepo : AddressRepository;
  let stateRepo : StateRepository
  let app: INestApplication;
  let authUser: UserEntity;
  beforeAll(async () => {
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
          entities: [UserEntity,AddressEntity,StateEntity],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([AddressRepository,UserRepository, StateRepository]),
      ],
      controllers: [AddressController],
      providers: [AddressService],
    })
      .overrideGuard(AuthGuard())
      .useValue({
        canActivate: async (context: ExecutionContext) => {
          authUser = await userRepo.save({
            phone: '09129120912',
          });
          const state = await stateRepo.save({title: 'BLOCK 24'})
          await addressRepo.save([
            {description: 'BLAH BLAH', user: authUser, state : state},
          ])
          const req = await context.switchToHttp().getRequest();
          req.user = await userRepo.findOne({phone: '09129120912'}); // Your user object
          return true;
        },
      })
      .compile();
    userRepo = await module.get<UserRepository>(UserRepository);
    addressRepo = await module.get<AddressRepository>(AddressRepository);
    stateRepo = await module.get<StateRepository>(StateRepository)

    // connection = module.get(Connection);
    app = module.createNestApplication();
    await app.init();
  });
  afterEach(async () => {
    // await stateRepo.query(`DELETE FROM states;`)
    await addressRepo.query(`DELETE FROM addresses;`);
    await userRepo.query(`DELETE FROM users;`);
  });

  it('/address GET return addresses of auth user', async function() {
    const user = await userRepo.save({phone:'09109120912'})

    await addressRepo.save([
      {description: 'Ave 245, Apt 215', user: user}
      ])
    const { body } = await supertest.agent(app.getHttpServer()).get('/address').expect(200);
    expect(body).toStrictEqual([{id: 2, description: 'BLAH BLAH', user: {id:2, phone: "09129120912"}}]);
  });

    afterAll(async () => {
    await app.close();
  });
  it('/address POST create new address for auth user', async function() {
    const { body } = await supertest.agent(app.getHttpServer()).post('/address')
      .send({description : 'Address ...', stateId: 1})
      .expect(201);

    expect(body).toStrictEqual(
      {
        address: {id: 2, description : 'Address ...',
          user: {id: 1, phone: '09129120912'},
          state: {id: 1, title: 'BLOCK 24'}
        }})
  });

});
