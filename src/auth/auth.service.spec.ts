import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthCredentialDTO } from './authCredential.dto';

describe('User Service',  ()=>{
  let app: INestApplication;
  let userRepo: UserRepository;
  let authServ: AuthService;
  beforeAll(async ()=>{
    const module : TestingModule = await Test.createTestingModule({
      imports:[
        JwtModule.register({
          secret: 'topSecret15',
          signOptions: {
            expiresIn: 3600,
          },
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + '/**/*.entity.{js,ts}'],
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
    expect(await authServ.findOrCreateUserWithPhone({phone: '09129120912'}))
      .toEqual({id: 1, phone: '09129120912'})
  })
  it('throw exception when user not found', async ()=> {
    const dto : AuthCredentialDTO = { phone: '09129120912', activation_code: 12345 }
    await expect(authServ.retrieveToken(dto)).rejects.toBeInstanceOf(NotFoundException)
  })
})
