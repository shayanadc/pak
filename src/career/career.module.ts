import { Module } from '@nestjs/common';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../auth/user.repository';
import { AddressRepository } from '../address/address.repository';
import { CityRepository } from '../address/city.repository';
import { StateRepository } from '../address/state.repository';
import { RequestRepository } from '../request/request.repository';
import { OrderRepository } from '../order/order.repository';
import { OrderDetailsRepository } from '../order/order.details.repository';
import { CityController } from '../city/city.controller';
import { CityService } from '../city/city.service';
import { CareerRepository } from './career.repository';

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
      OrderRepository,
      OrderDetailsRepository,
      CareerRepository,
    ]),
  ],
  controllers: [CareerController],
  providers: [CareerService],
})
export class CareerModule {}
