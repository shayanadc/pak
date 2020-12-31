import { Module } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { NotifyController } from './notify.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyRepository } from './notify.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NotifyRepository])],
  providers: [NotifyService],
  controllers: [NotifyController],
})
export class NotifyModule {}
