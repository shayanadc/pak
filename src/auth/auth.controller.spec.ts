import supertest = require('supertest');
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { Connection } from 'typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthCredentialDTO } from './authCredential.dto';

describe('Create And Toke User API', ()=>{
  let app: INestApplication
  let userRepo : UserRepository
  // let connection : Connection
  beforeAll(async ()=> {
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
    // connection = module.get(Connection);
    app =  module.createNestApplication()
    await app.init()
  })

  afterEach(async ()=>{
    await userRepo.query(`DELETE FROM users;`);
  })


  it('auth/token POST Create New Token', async () => {
    JwtService.prototype.sign = jest.fn().mockReturnValue('@1a$A4@SHS5af151ag60kagJAgaaAKjAK1');
    await userRepo.save([{
      phone: '09129120912'
    }])
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/auth/token')
      .send({
        phone: '09129120912',
        activation_code: 123,
      } as AuthCredentialDTO)
      .expect(201);
      expect(body).toEqual({ accessToken: '@1a$A4@SHS5af151ag60kagJAgaaAKjAK1' });
      expect(JwtService.prototype.sign).toHaveBeenCalledTimes(1);
    });


  it('/auth/login POST return user with specific phone number', async function() {
    const {body} = await supertest.agent(app.getHttpServer()).post('/auth/login').
    send({phone: '09129120912'}).expect(201)
    expect(body).toEqual({user: {id:2, phone: '09129120912'}})
  });
  afterAll(async () => {
    await app.close();
  });
})