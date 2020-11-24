import { EntityRepository, Repository } from 'typeorm';
import { RequestEntity } from '../request/request.entity';
import { MaterialEntity } from './material.entity';

@EntityRepository(MaterialEntity)
export class MaterialRepository extends Repository<MaterialEntity> {
  async index(): Promise<MaterialEntity[]> {
    return await this.find();
  }
}
