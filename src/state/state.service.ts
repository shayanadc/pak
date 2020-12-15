import { Injectable, NotFoundException } from '@nestjs/common';
import { StateEntity } from '../address/state.entity';
import { StateRepository } from '../address/state.repository';
import { StateDto } from './state.dto';
import { CityRepository } from '../address/city.repository';

@Injectable()
export class StateService {
  constructor(
    private stateRepo: StateRepository,
    private cityRepo: CityRepository,
  ) {}
  async store(request: StateDto): Promise<StateEntity> {
    const city = await this.cityRepo.findOne({ id: request.cityId });
    if (!city) {
      throw new NotFoundException('Could not find city for this id');
    }
    return await this.stateRepo.store(request, city);
  }
  async index(): Promise<StateEntity[]> {
    return await this.stateRepo.index();
  }
}
