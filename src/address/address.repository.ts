import { EntityRepository, Repository } from 'typeorm';
import { AddressEntity } from './address.entity';
import { UserEntity } from '../auth/user.entity';
@EntityRepository(AddressEntity)
export class AddressRepository extends Repository<AddressEntity>{
  async getAll(user:UserEntity): Promise<AddressEntity[]>{

    return await this.find({
      relations: ['user'],
      where: { id: user.id }
    })
  }
}