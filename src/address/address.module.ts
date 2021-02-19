import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { UserRepository } from '../auth/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressRepository } from './address.repository';
import { StateRepository } from './state.repository';
import { CityRepository } from './city.repository';
import { RequestRepository } from '../request/request.repository';
import { OrderRepository } from '../order/order.repository';
import { OrderDetailsRepository } from '../order/order.details.repository';
import { CareerRepository } from '../career/career.repository';

@Module({
  imports: [
    UserRepository,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret15',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([
      AddressRepository,
      UserRepository,
      StateRepository,
      CityRepository,
      RequestRepository,
      OrderRepository,
      OrderDetailsRepository,
      CareerRepository,
    ]),
  ],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
