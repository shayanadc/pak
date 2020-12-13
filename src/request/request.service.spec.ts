import { ExecutionContext, INestApplication } from '@nestjs/common';
import { UserRepository } from '../auth/user.repository';
import { AddressRepository } from '../address/address.repository';
import { StateRepository } from '../address/state.repository';
import { RequestRepository } from './request.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from '../address/address.entity';
import { CityEntity } from '../address/city.entity';
import { StateEntity } from '../address/state.entity';
import { RequestEntity } from './request.entity';
import { CityRepository } from '../address/city.repository';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { OrderDetailEntity } from '../order/orderDetail.entity';
import { OrderEntity } from '../order/order.entity';
import { MaterialEntity } from '../material/material.entity';

describe('User Service', () => {
  let app: INestApplication;
  let userRepo: UserRepository;
  let addressRepo: AddressRepository;
  let stateRepository: StateRepository;
  let requestRepository: RequestRepository;
  let reqServ: RequestService;

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
            OrderEntity,
            OrderDetailEntity,
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
    reqServ = await module.get(RequestService);

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
  it('delete user request item', async () => {
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
      userId: 2,
      address: address,
      type: 1,
      date: '2000-01-01 00:00:00',
    });
    const req = await requestRepository.save({
      user: user,
      address: address,
      type: 1,
      date: '2000-01-01 00:00:00',
    });
    const id = 1;
    await reqServ.delete(user, id);
    expect((await requestRepository.find()).length).toEqual(1);
  });
});
