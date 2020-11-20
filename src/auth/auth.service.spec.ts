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

describe('User Service',  ()=>{
  let app: INestApplication;
  let userRepo: UserRepository;
  let authServ: AuthService;
  beforeAll(async ()=>{
    const module : TestingModule = await Test.createTestingModule({
      imports:[
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
          entities: [UserEntity,AddressEntity],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([UserRepository])
      ],
      controllers: [AuthController],
      providers: [AuthService]
    }).compile();
    userRepo = await module.get<UserRepository>(UserRepository)
    authServ = await  module.get<AuthService>(AuthService)
    // connection = module.get(Connection);
    app =  module.createNestApplication()
    await app.init()
  })
  afterEach(async ()=>{
    await userRepo.query(`DELETE FROM users;`);
  })
  it('return existed user', async ()=> {
    await userRepo.save([{
        phone: '09129120912'
    }])
    const genSpy = jest.spyOn(authServ, 'generateCode');
    const cacheSpy = jest.spyOn(authServ, 'setInMemory');

    expect(await authServ.findOrCreateUserWithPhone({phone: '09129120912'}))
      .toEqual({id: 1, phone: '09129120912'})
    expect(genSpy).toBeCalledTimes(1)
    expect(cacheSpy).toBeCalledTimes(1)
  })
  it('throw exception when user not found', async ()=> {
    const dto : AuthCredentialDTO = { phone: '09129120912', activation_code: 12345 }
    await expect(authServ.retrieveToken(dto)).rejects.toBeInstanceOf(NotFoundException)
  })

  it('throw exception when activation code is wrong', async ()=> {
    await userRepo.save([{
      phone: '09129120912'
    }])
    const dto : AuthCredentialDTO = { phone: '09129120912', activation_code: 12345 }
    authServ.isCodeMatch = jest.fn().mockReturnValue(false)
    await expect(authServ.retrieveToken(dto)).rejects.toBeInstanceOf(NotFoundException)
  })
})
