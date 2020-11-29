import { EntityRepository, Repository } from 'typeorm';
import { CityEntity } from './city.entity';

@EntityRepository(CityEntity)
export class CityRepository extends Repository<CityEntity> {
  async index(): Promise<CityEntity[]> {
    return await this.find();
  }
}
