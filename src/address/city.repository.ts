import { EntityRepository, Repository } from 'typeorm';
import { CityEntity } from './city.entity';

@EntityRepository(CityEntity)
export class CityRepository extends Repository<CityEntity>{

}