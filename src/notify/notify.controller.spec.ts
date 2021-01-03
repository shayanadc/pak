import { Test, TestingModule } from '@nestjs/testing';
import { NotifyController } from './notify.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import supertest = require('supertest');
import { NotifyEntity } from './notify.entity';
import { NotifyRepository } from './notify.repository';
import { getConnection } from 'typeorm';
import { NotifyService } from './notify.service';

describe('NotifyController', () => {
  let app: INestApplication;
  let notifRepo: NotifyRepository;
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
          entities: [NotifyEntity],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([NotifyRepository]),
      ],
      providers: [NotifyService],
      controllers: [NotifyController],
    }).compile();
    notifRepo = await module.get<NotifyRepository>(NotifyRepository);
    app = module.createNestApplication();
    await app.init();
  });
  afterEach(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });
  it('/city GET return all cities', async () => {
    const notify = await notifRepo.save([
      {
        title: 'Coming...',
        description: 'THE...',
      },
    ]);
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/notify')
      .expect(200);
    expect(body).toEqual({
      message: 'All Notifies',
      notifies: [
        {
          id: 1,
          title: 'Coming...',
          description: 'THE...',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
    });
  });
});
