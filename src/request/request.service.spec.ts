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
import { getConnection } from 'typeorm';
import { ProvinceEntity } from '../city/province.entity';
import { InvoiceEntity } from '../invoice/invoice.entity';
import { CareerEntity } from '../career/career.entity';
import { CommentEntity } from '../comments/comment.entity';

describe('Request Service', () => {
  let app: INestApplication;
  let userRepo: UserRepository;
  let addressRepo: AddressRepository;
  let stateRepository: StateRepository;
  let requestRepository: RequestRepository;
  let reqServ: RequestService;

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
            OrderEntity,
            OrderDetailEntity,
            MaterialEntity,
            ProvinceEntity,
            InvoiceEntity,
            CareerEntity,
            CommentEntity,
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
    }).compile();
    reqServ = await module.get(RequestService);

    userRepo = await module.get<UserRepository>(UserRepository);
    addressRepo = await module.get<AddressRepository>(AddressRepository);
    stateRepository = await module.get<StateRepository>(StateRepository);
    requestRepository = await module.get<RequestRepository>(RequestRepository);

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });
  it('return work shift 1', async () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2000-03-05T20:30:00.000Z').getTime());
    expect(reqServ.getWorkShift()).toEqual(3);
  });
  it('calculate next time after period', async () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2000-03-05T20:30:00.000Z').getTime());
    const date = new Date('2000-02-02T20:30:00.000Z');
    const period = 30;
    expect(reqServ.calcNextTime(date, period)).toEqual(
      new Date('2000-04-01T19:30:00.000Z'),
    );
  });
  it('calculate next time before period', async () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2000-02-22T20:30:00.000Z').getTime());
    const date = new Date('2000-02-02T20:30:00.000Z');
    const period = 30;
    expect(reqServ.calcNextTime(date, period)).toEqual(
      new Date('2000-03-03T20:30:00.000Z'),
    );
  });
  it('clone new periodic request', async () => {
    const user = await userRepo.save({
      phone: '09129120912',
      code: '124asg',
    });
    const state = await stateRepository.save({
      title: 'BLOCK',
    });

    const address = await addressRepo.save({
      description: 'Addresss.....',
      state: state,
      user: user,
    });
    const req = await requestRepository.save({
      user: user,
      address: address,
      type: 3,
      period: 30,
      date: '2000-02-02T20:30:00.000Z',
    });
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2000-02-22T20:30:00.000Z').getTime());
    const newReq = await reqServ.createNext(req);
    expect(newReq.date).toEqual(new Date('2000-03-03T20:30:00.000Z'));
    expect((await requestRepository.find()).length).toEqual(2);
  });
  it('delete user request item', async () => {
    const user = await userRepo.save({
      phone: '09129120912',
      code: '1sdg35',
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
      date: '2000-02-02T20:30:00.000Z',
    });
    const req = await requestRepository.save({
      user: user,
      address: address,
      type: 1,
      date: '2000-02-02T20:30:00.000Z',
    });
    const id = 1;
    await reqServ.delete(user, id);
    expect((await requestRepository.find()).length).toEqual(1);
  });
});
