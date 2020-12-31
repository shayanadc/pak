import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerRepository } from './banner.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BannerRepository])],
  providers: [BannerService],
  controllers: [BannerController],
})
export class BannerModule {}
