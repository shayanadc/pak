import supertest = require('supertest');
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { Connection } from 'typeorm';

describe('Create And Toke User API', ()=>{
  let app: INestApplication
  // let userRepo : UserRepository
  // let connection : Connection
  beforeAll(async ()=> {
    const module : TestingModule = await Test.createTestingModule({
      imports:[
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
    // userRepo = await module.get<UserRepository>(UserRepository)
    // connection = module.get(Connection);
    app =  module.createNestApplication()
    await app.init()
  })
  it('should return user with specific phone number', async function() {
    const {body} = await supertest.agent(app.getHttpServer()).post('/auth/login').
    send({phone: '09129120912'}).expect(201)
    expect(body).toEqual({user: {id:1, phone: '09129120912'}})
  });
  afterAll(async () => {
    await app.close();
  });
})