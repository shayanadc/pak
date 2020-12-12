import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../auth/user.repository';
import { AddressRepository } from '../address/address.repository';
import { CityRepository } from '../address/city.repository';
import { StateRepository } from '../address/state.repository';
import { RequestRepository } from '../request/request.repository';
import { OrderRepository } from './order.repository';
import { OrderDetailsRepository } from './order.details.repository';
import { RequestController } from '../request/request.controller';
import { RequestService } from '../request/request.service';
import { AuthService } from '../auth/auth.service';
import { MaterialRepository } from '../material/material.repository';
import { SmsProvider } from '../auth/sms.provider';
import { CacheProvider } from '../auth/cache.provider';

@Module({
  imports: [
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
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
