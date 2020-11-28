import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from './address/address.module';
import { RequestModule } from './request/request.module';
import { MaterialModule } from './material/material.module';

@Module({
  imports: [
    AuthModule,
    AddressModule,
    RequestModule,
    MaterialModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      username: 'postgres',
      password: 'password',
      database: 'pak',
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: true,
      migrationsRun: true,
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        migrationsDir: 'src/migrations',
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
