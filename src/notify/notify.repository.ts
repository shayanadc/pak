import { EntityRepository, Repository } from 'typeorm';
import { NotifyEntity } from './notify.entity';

@EntityRepository(NotifyEntity)
export class NotifyRepository extends Repository<NotifyEntity> {
  async index(): Promise<NotifyEntity[]> {
    return await this.find();
  }
}
