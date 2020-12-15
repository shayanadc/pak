import { EntityRepository, Repository } from 'typeorm';
import { RequestEntity } from '../request/request.entity';
import { MaterialEntity } from './material.entity';
import { MaterialDto } from './material.dto';

@EntityRepository(MaterialEntity)
export class MaterialRepository extends Repository<MaterialEntity> {
  async index(): Promise<MaterialEntity[]> {
    return await this.find();
  }
  async store(request: MaterialDto): Promise<MaterialEntity> {
    const material = new MaterialEntity();
    material.cost = request.cost;
    material.title = request.title;
    await material.save();
    return material;
  }
}
