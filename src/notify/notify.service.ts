import { Injectable } from '@nestjs/common';
import { NotifyRepository } from './notify.repository';
import { NotifyEntity } from './notify.entity';

@Injectable()
export class NotifyService {
  constructor(private notifyRepo: NotifyRepository) {}
  async index(): Promise<NotifyEntity[]> {
    return await this.notifyRepo.index();
  }
}
