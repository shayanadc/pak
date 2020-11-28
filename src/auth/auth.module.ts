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

@Module({
  imports: [
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
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CodeGenerator,
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
