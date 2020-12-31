import { Module } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { NotifyController } from './notify.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../auth/user.repository';
import { AddressRepository } from '../address/address.repository';
import { CityRepository } from '../address/city.repository';
import { StateRepository } from '../address/state.repository';
import { RequestRepository } from '../request/request.repository';
import { MaterialRepository } from '../material/material.repository';
import { OrderRepository } from '../order/order.repository';
import { OrderDetailsRepository } from '../order/order.details.repository';
import { NotifyRepository } from './notify.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NotifyRepository])],
  providers: [NotifyService],
  controllers: [NotifyController],
})
export class NotifyModule {}
