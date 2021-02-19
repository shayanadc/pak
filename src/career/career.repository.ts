import { EntityRepository, Repository } from 'typeorm';
import { ProvinceEntity } from '../city/province.entity';
import { CareerEntity } from './career.entity';
import { CityEntity } from '../address/city.entity';

@EntityRepository(CareerEntity)
export class CareerRepository extends Repository<CareerEntity> {
  async index(): Promise<CareerEntity[]> {
    return await this.find();
  }
}
