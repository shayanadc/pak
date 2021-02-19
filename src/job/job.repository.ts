import { EntityRepository, Repository } from 'typeorm';
import { ProvinceEntity } from '../city/province.entity';
import { JobEntity } from './job.entity';
import { CityEntity } from '../address/city.entity';

@EntityRepository(JobEntity)
export class JobRepository extends Repository<JobEntity> {
  async index(): Promise<JobEntity[]> {
    return await this.find();
  }
}
