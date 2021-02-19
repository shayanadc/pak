import { Injectable } from '@nestjs/common';
import { CareerEntity } from './career.entity';
import { CareerRepository } from './career.repository';

@Injectable()
export class CareerService {
  constructor(private jobRepository: CareerRepository) {}
  async index(): Promise<CareerEntity[]> {
    return await this.jobRepository.index();
  }
}
