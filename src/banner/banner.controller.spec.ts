import { Test, TestingModule } from '@nestjs/testing';
import supertest = require('supertest');
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { BannerEntity } from './banner.entity';
import { BannerRepository } from './banner.repository';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';

describe('BannerController', () => {
  let app: INestApplication;
  let bannerRepo: BannerRepository;
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
          entities: [BannerEntity],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([BannerRepository]),
      ],
      providers: [BannerService],
      controllers: [BannerController],
    }).compile();
    bannerRepo = await module.get<BannerRepository>(BannerRepository);
    app = module.createNestApplication();
    await app.init();
  });
  afterEach(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });
  it('/banner GET return all banners', async () => {
    const banner = await bannerRepo.save([
      {
        title: 'Coming...',
        image: 'THE...',
        link: 'Link',
      },
    ]);
    const { body } = await supertest
      .agent(app.getHttpServer())
      .get('/banner')
      .expect(200);
    expect(body).toEqual({
      message: 'All Banners',
      banners: [
        {
          id: 1,
          title: 'Coming...',
          image: 'THE...',
          link: 'Link',
        },
      ],
    });
  });
});
