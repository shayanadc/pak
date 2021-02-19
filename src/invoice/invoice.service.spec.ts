import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { OrderService } from '../order/order.service';
import { OrderRepository } from '../order/order.repository';
import { RequestRepository } from '../request/request.repository';
import { UserRepository } from '../auth/user.repository';
import { AddressRepository } from '../address/address.repository';
import { StateRepository } from '../address/state.repository';
import { CityRepository } from '../address/city.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from '../address/address.entity';
import { CityEntity } from '../address/city.entity';
import { StateEntity } from '../address/state.entity';
import { RequestEntity } from '../request/request.entity';
import { MaterialEntity } from '../material/material.entity';
import { OrderEntity } from '../order/order.entity';
import { OrderDetailEntity } from '../order/orderDetail.entity';
import { ProvinceEntity } from '../city/province.entity';
import { MaterialRepository } from '../material/material.repository';
import { OrderDetailsRepository } from '../order/order.details.repository';
import { InvoiceEntity } from './invoice.entity';
import { InvoiceRepository } from './invoice.repository';
import { getConnection } from 'typeorm';
import { CareerEntity } from '../career/career.entity';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let orderRepo: OrderRepository;
  let invoiceRepo: InvoiceRepository;
  let requestRepo: RequestRepository;
  let userRepo: UserRepository;
  let addressRepo: AddressRepository;
  let stateRepository: StateRepository;
  let cityRepo: CityRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          OrderRepository,
          OrderDetailsRepository,
          InvoiceRepository,
        ]),
      ],
      providers: [InvoiceService],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    invoiceRepo = module.get<InvoiceRepository>(InvoiceRepository);
    orderRepo = module.get<OrderRepository>(OrderRepository);
    requestRepo = module.get<RequestRepository>(RequestRepository);
    userRepo = module.get<UserRepository>(UserRepository);
    addressRepo = module.get<AddressRepository>(AddressRepository);
    stateRepository = module.get<StateRepository>(StateRepository);
    cityRepo = module.get<CityRepository>(CityRepository);
  });

  afterEach(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });

  it('should follow invoice scenario', async () => {
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
      },
      {
        user: user1,
        issuer: driver1,
        request: request1[1],
        price: 4000,
      },
      {
        user: user2,
        issuer: driver2,
        request: request2,
        price: 4000,
      },
      {
        user: user3,
        issuer: driver2,
        request: request3,
        price: 9000,
      },
    ]);
    const [
      submittedOrders,
      countSubmittedOrders,
    ] = await orderRepo.findAndCount({ user: user1 });
    expect(countSubmittedOrders).toEqual(2);

    await service.submitInvoice(user1);
    const [
      user1submitted,
      user1submittedCount,
    ] = await invoiceRepo.findAndCount({
      where: { user: user1, amount: 8000 },
    });
    expect(user1submittedCount).toEqual(1);
    await service.submitInvoice(user3);

    const [
      user3submitted,
      user3submittedCount,
    ] = await invoiceRepo.findAndCount({
      where: { user: user3, amount: 9000 },
    });
    expect(user3submittedCount).toEqual(1);
    expect((await invoiceRepo.find()).length).toEqual(2);
    let idleOrders = await orderRepo.find({
      where: { user: user1, invoice: null },
    });
    expect(idleOrders.length).toEqual(0);
    idleOrders = await orderRepo.find({
      where: { user: user2, invoice: null },
    });
    expect(idleOrders.length).toEqual(1);
  });
});
