import { EntityRepository, Repository } from 'typeorm';
import { AddressEntity } from './address.entity';
import { UserEntity } from '../auth/user.entity';
import { AddressDto } from './address.dto';
import { StateEntity } from './state.entity';
@EntityRepository(AddressEntity)
export class AddressRepository extends Repository<AddressEntity>{
  async getAll(user:UserEntity): Promise<AddressEntity[]>{

    return await this.find({
      relations: ['user'],
      where: { id: user.id }
    })
  }
  async store(user: UserEntity, state: StateEntity, addressDto: AddressDto) : Promise<AddressEntity>{
    const address = new AddressEntity()
    address.description = addressDto.description
    address.user = user
    address.state = state
    await address.save()
    return address
  }
}