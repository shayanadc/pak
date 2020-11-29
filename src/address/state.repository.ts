import { EntityRepository, Repository } from 'typeorm';
import { StateEntity } from './state.entity';

@EntityRepository(StateEntity)
export class StateRepository extends Repository<StateEntity> {
  async index(): Promise<StateEntity[]> {
    console.log(await this.find());
    return await this.find();
  }
}
