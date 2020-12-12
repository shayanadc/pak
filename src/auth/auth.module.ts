import { CacheModule, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressRepository } from '../address/address.repository';
import { CityRepository } from '../address/city.repository';
import { StateRepository } from '../address/state.repository';
import { RequestRepository } from '../request/request.repository';
import CodeGenerator from './code-generator';
import { SmsProvider } from './sms.provider';
import { CacheProvider } from './cache.provider';
import { JwtStrategy } from './jwt.strategy';
import { OrderRepository } from '../order/order.repository';
import { OrderDetailsRepository } from '../order/order.details.repository';
import { OrderService } from '../order/order.service';
import { MaterialRepository } from '../material/material.repository';

@Module({
  imports: [
    OrderRepository,
    CacheModule.register(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret15',
      signOptions: {
        expiresIn: 3600,
      },
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
    CodeGenerator,
    OrderService,
    JwtStrategy,
    {
      // You can switch useClass to different implementation
      useClass: SmsProvider,
      provide: 'SmsInterface',
    },
    {
      // You can switch useClass to different implementation
      useClass: CacheProvider,
      provide: 'CacheInterface',
    },
  ],
})
export class AuthModule {}
