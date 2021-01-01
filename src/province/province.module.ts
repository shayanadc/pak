import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../auth/user.repository';
import { ProvinceRepository } from '../city/province.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, ProvinceRepository])],
  providers: [ProvinceService],
  controllers: [ProvinceController],
})
export class ProvinceModule {}
