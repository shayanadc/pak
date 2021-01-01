import { Injectable } from '@nestjs/common';
import { CityRepository } from '../address/city.repository';
import { CityEntity } from '../address/city.entity';
import { ProvinceRepository } from '../city/province.repository';
import { ProvinceEntity } from '../city/province.entity';

@Injectable()
export class ProvinceService {
  constructor(private provinceRepo: ProvinceRepository) {}
  async index(): Promise<ProvinceEntity[]> {
    return await this.provinceRepo.find();
  }
}
