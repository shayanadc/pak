import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { UserRepository } from '../auth/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from './address.entity';
import { StateEntity } from './state.entity';
import { CityEntity } from './city.entity';
import { RequestEntity } from '../request/request.entity';
import { AddressRepository } from './address.repository';
import { StateRepository } from './state.repository';
import { CityRepository } from './city.repository';
import { RequestRepository } from '../request/request.repository';

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
    ]),
  ],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
