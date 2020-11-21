import { EntityRepository, Repository } from 'typeorm';
import { StateEntity } from './state.entity';

@EntityRepository(StateEntity)
export class StateRepository extends Repository<StateEntity>{

}