import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthCredentialDTO } from './authCredential.dto';
import { PassportModule } from '@nestjs/passport';
import { UserEntity } from './user.entity';
import { AddressEntity } from '../address/address.entity';
import { CityRepository } from '../address/city.repository';
import { StateRepository } from '../address/state.repository';
import { AddressRepository } from '../address/address.repository';
import { CityEntity } from '../address/city.entity';
import { StateEntity } from '../address/state.entity';
import SmsInterface from './sms.interface';
import CodeGenerator from './code-generator';
import CacheInterface from './cache.interface';
import { RequestEntity } from '../request/request.entity';
import { RequestRepository } from '../request/request.repository';
import { OrderEntity } from '../order/order.entity';
import { OrderDetailEntity } from '../order/orderDetail.entity';
import { OrderService } from '../order/order.service';
import { OrderRepository } from '../order/order.repository';
import { OrderDetailsRepository } from '../order/order.details.repository';
import { MaterialRepository } from '../material/material.repository';
import { MaterialEntity } from '../material/material.entity';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

describe('User Service', () => {
  let app: INestApplication;
  let userRepo: UserRepository;
  let authServ: AuthService;
  let smsService: SmsInterface;
  let cacheService: CacheInterface;
  let codeGenServ: CodeGenerator;
  const smsProvider = {
    provide: 'SmsInterface',
    useFactory: () => ({
      sendMessage: jest.fn(),
    }),
  };
  const cacheProvider = {
    provide: 'CacheInterface',
    useFactory: () => ({
      set: jest.fn(),
      get: jest.fn().mockReturnValue('12345'),
    }),
  };
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
          MaterialRepository,
          OrderRepository,
          OrderDetailsRepository,
        ]),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        smsProvider,
        cacheProvider,
        CodeGenerator,
        OrderService,
      ],
    }).compile();
    userRepo = await module.get<UserRepository>(UserRepository);
    authServ = await module.get<AuthService>(AuthService);
    codeGenServ = await module.get(CodeGenerator);
    smsService = await module.get('SmsInterface');
    cacheService = await module.get('CacheInterface');

    // connection = module.get(Connection);
    app = module.createNestApplication();
    await app.init();
  });
  afterEach(async () => {
    await userRepo.query(`DELETE FROM users;`);
  });
  it('return existed user', async () => {
    await userRepo.save([
      {
        phone: '09129120912',
      },
    ]);
    const generateSpy = jest.spyOn(codeGenServ, 'generate');
    generateSpy.mockReturnValue('12345');

    expect(
      await authServ.findOrCreateUserWithPhone({ phone: '09129120912' }),
    ).toEqual({
      id: 1,
      phone: '09129120912',
      name: null,
      lname: null,
      disable: false,
      roles: ['user'],
    });

    expect(smsService.sendMessage).toBeCalledTimes(1);
    expect(cacheService.set).toBeCalledTimes(1);
    expect(cacheService.set).toBeCalledWith('09129120912', '12345');
  });
  it('should check matching act code', async () => {
    const authCredential: AuthCredentialDTO = {
      phone: '09129120912',
      activation_code: '12345',
    };
    const x = await authServ.isCodeMatch(authCredential);
    expect(cacheService.get).toBeCalledTimes(1);
    expect(x).toEqual(true);
  });
  it('throw exception when user not found', async () => {
    const dto: AuthCredentialDTO = {
      phone: '09129120912',
      activation_code: '12345',
    };
    await expect(authServ.retrieveToken(dto)).rejects.toBeInstanceOf(
      EntityNotFoundError,
    );
  });

  it('throw exception when activation code is wrong', async () => {
    await userRepo.save([
      {
        phone: '09129120912',
      },
    ]);
    const dto: AuthCredentialDTO = {
      phone: '09129120912',
      activation_code: '12345',
    };
    authServ.isCodeMatch = jest.fn().mockReturnValue(false);
    await expect(authServ.retrieveToken(dto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
