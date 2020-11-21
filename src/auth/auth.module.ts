import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [UserRepository]
})
export class AuthModule {}
