import { Test } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from '../address/address.entity';
import { CityEntity } from '../address/city.entity';
import { StateEntity } from '../address/state.entity';
import { RequestEntity } from '../request/request.entity';
import { MaterialEntity } from '../material/material.entity';
import { OrderEntity } from './order.entity';
import { OrderDetailEntity } from './orderDetail.entity';
import { ProvinceEntity } from '../city/province.entity';
import { UserRepository } from '../auth/user.repository';
import { AddressRepository } from '../address/address.repository';
import { CityRepository } from '../address/city.repository';
import { StateRepository } from '../address/state.repository';
import { RequestRepository } from '../request/request.repository';
import { MaterialRepository } from '../material/material.repository';
import { OrderRepository } from './order.repository';
import { OrderDetailsRepository } from './order.details.repository';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepo: OrderRepository;
  let requestRepo: RequestRepository;
  let userRepo: UserRepository;
  let addressRepo: AddressRepository;
  let stateRepository: StateRepository;
  let cityRepo: CityRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
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
            OrderEntity,
            OrderDetailEntity,
            ProvinceEntity,
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
          OrderRepository,
          OrderDetailsRepository,
        ]),
      ],
      providers: [OrderService],
    }).compile();
    service = module.get<OrderService>(OrderService);
    orderRepo = module.get<OrderRepository>(OrderRepository);
    requestRepo = module.get<RequestRepository>(RequestRepository);
    userRepo = module.get<UserRepository>(UserRepository);
    addressRepo = module.get<AddressRepository>(AddressRepository);
    stateRepository = module.get<StateRepository>(StateRepository);
    cityRepo = module.get<CityRepository>(CityRepository);
  });

  it('should update idle order to ready for settlement', async () => {
    const driver1 = await userRepo.save({
      phone: '09990990990',
    });
    const driver2 = await userRepo.save({
      phone: '09120990990',
    });
    const user1 = await userRepo.save({
      phone: '09129120912',
    });
    const user2 = await userRepo.save({
      phone: '09109120912',
    });
    const user3 = await userRepo.save({
      phone: '09199999999',
    });
    const city = await cityRepo.save({
      name: 'GORGAN',
    });
    const state = await stateRepository.save({
      title: 'BLOCK',
      city: await cityRepo.findOne({ id: city.id }),
    });
    const address = await addressRepo.save({
      description: 'Addresss.....',
      state: state,
      user: user1,
    });
    await requestRepo.save({
      user: user1,
      address: address,
      type: 3,
      date: '2000-01-01 00:00:00',
    });
    await requestRepo.save({
      user: user2,
      address: address,
      type: 1,
      done: true,
      date: '2000-01-01 00:00:00',
    });
    await requestRepo.save({
      user: user3,
      address: address,
      type: 2,
      done: true,
      date: '2000-01-01 00:00:00',
    });
    const request1 = await requestRepo.save([
      {
        user: user1,
        address: address,
        type: 2,
        date: '2000-01-01 00:00:00',
      },
      {
        user: user1,
        address: address,
        type: 3,
        date: '2000-01-01 00:00:00',
      },
    ]);
    const request2 = await requestRepo.save({
      user: user2,
      address: address,
      type: 2,
      date: '2000-01-01 00:00:00',
    });
    const request3 = await requestRepo.save({
      user: user3,
      address: address,
      type: 2,
      date: '2000-01-01 00:00:00',
    });
    await orderRepo.save([
      {
        user: user1,
        issuer: driver1,
        request: request1[0],
        price: 4000,
        // details: detail1,
      },
      {
        user: user1,
        issuer: driver1,
        request: request1[1],
        price: 4000,
        // details: detail1,
      },
      {
        user: user2,
        issuer: driver2,
        request: request2,
        price: 4000,
        // details: detail1,
      },
      {
        user: user3,
        issuer: driver2,
        request: request3,
        price: 9000,
        // details: detail2,
      },
    ]);
    const [
      submittedOrders,
      countSubmittedOrders,
    ] = await orderRepo.findAndCount();
    expect(countSubmittedOrders).toEqual(4);

    await service.requestForSettle(user1);
    await service.requestForSettle(user3);

    let readyForUser1 = await service.readyForSettle(user1);
    expect(readyForUser1.length).toEqual(2);

    const readyForUser2 = await service.readyForSettle(user2);
    expect(readyForUser2.length).toEqual(0);

    let usersReadyForSettle = await service.waitingUserForSettlemnt();
    expect(usersReadyForSettle.length).toEqual(2);

    await service.settleFor(user1);
    readyForUser1 = await service.readyForSettle(user1);
    expect(readyForUser1.length).toEqual(0);

    usersReadyForSettle = await service.waitingUserForSettlemnt();
    expect(usersReadyForSettle.length).toEqual(1);

    await service.deliveredFor(driver1);
    const delivered = await orderRepo.find({ where: { delivered: true } });
    expect(delivered.length).toEqual(2);
  });
});
