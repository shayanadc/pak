import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from './address/address.module';
import { RequestModule } from './request/request.module';
import { MaterialModule } from './material/material.module';
import { StateModule } from './state/state.module';
import { CityModule } from './city/city.module';
import { AppController } from './app.controller';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';

import { NotifyModule } from './notify/notify.module';
import { BannerModule } from './banner/banner.module';
import { InvoiceModule } from './invoice/invoice.module';
import * as env from 'dotenv';
env.config();

@Module({
  imports: [
    AuthModule,
    AddressModule,
    RequestModule,
    MaterialModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_SERVER || 'postgres',
      // host: 'localhost',
      username: 'postgres',
      password: 'password',
      // port: 25432,
      database: 'pak',
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: true,
      migrationsRun: true,
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        migrationsDir: 'src/migrations',
      },
    }),
    StateModule,
    CityModule,
    OrderModule,
    UserModule,
    NotifyModule,
    BannerModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
