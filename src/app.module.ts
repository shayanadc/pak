import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from './address/address.module';
import { RequestModule } from './request/request.module';

@Module({
  imports: [AuthModule, AddressModule, RequestModule,
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'shayan',
    //   password: 'pg123',
    //   database: 'togo',
    //   entities: [__dirname + '/**/*.entity.{js,ts}'],
    //   synchronize: true,
    //   migrationsRun: true,
    //   migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    //   cli: {
    //     migrationsDir: 'src/migrations',
    //   },
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
