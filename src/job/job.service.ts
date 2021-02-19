import { Injectable } from '@nestjs/common';
import { CityRepository } from '../address/city.repository';
import { CityEntity } from '../address/city.entity';
import { JobEntity } from './job.entity';
import { JobRepository } from './job.repository';

@Injectable()
export class JobService {
  constructor(private jobRepository: JobRepository) {}
  async index(): Promise<JobEntity[]> {
    return await this.jobRepository.index();
  }
}
