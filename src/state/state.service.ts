import { Injectable } from '@nestjs/common';
import { StateEntity } from '../address/state.entity';
import { StateRepository } from '../address/state.repository';

@Injectable()
export class StateService {
  constructor(private stateRepo: StateRepository) {}

  async index(): Promise<StateEntity[]> {
    return await this.stateRepo.index();
  }
}
