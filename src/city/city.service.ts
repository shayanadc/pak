import { Injectable } from '@nestjs/common';
import { CityEntity } from '../address/city.entity';
import { CityRepository } from '../address/city.repository';

@Injectable()
export class CityService {
  constructor(private cityRepo: CityRepository) {}
  async index(): Promise<CityEntity[]> {
    return await this.cityRepo.index();
  }
}
