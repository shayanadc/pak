import { EntityRepository, Repository } from 'typeorm';
import { ProvinceEntity } from './province.entity';

@EntityRepository(ProvinceEntity)
export class ProvinceRepository extends Repository<ProvinceEntity> {}
