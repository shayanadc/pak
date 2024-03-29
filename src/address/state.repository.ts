import { EntityRepository, Repository } from 'typeorm';
import { StateEntity } from './state.entity';
import { StateDto } from '../state/state.dto';
import { CityEntity } from './city.entity';

@EntityRepository(StateEntity)
export class StateRepository extends Repository<StateEntity> {
  async index(query): Promise<StateEntity[]> {
    return await this.find(query);
  }
  async store(request: StateDto, city: CityEntity): Promise<StateEntity> {
    const state = new StateEntity();
    state.city = city;
    state.title = request.title;
    await state.save();
    return state;
  }
}
