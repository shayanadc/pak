import { EntityRepository, Repository } from 'typeorm';
import { AddressEntity, BuildingType } from './address.entity';
import { UserEntity } from '../auth/user.entity';
import { AddressDto } from './address.dto';
import { StateEntity } from './state.entity';
import { CareerEntity } from '../career/career.entity';

@EntityRepository(AddressEntity)
export class AddressRepository extends Repository<AddressEntity> {
  async getAll(user: UserEntity): Promise<AddressEntity[]> {
    return await this.find({
      relations: ['user'],
      where: { user: user },
      order: { id: 'DESC' },
    });
  }
  async store(
    user: UserEntity,
    state: StateEntity,
    career: CareerEntity,
    addressDto: AddressDto,
  ): Promise<AddressEntity> {
    const address = new AddressEntity();
    address.description = addressDto.description;
    address.user = user;
    address.state = state;
    address.type = addressDto.type;
    address.zipCode = addressDto.zipCode;
    address.career = career;
    await address.save();
    return address;
  }

  async deleteItem(user, param): Promise<any> {
    const rest = await this.delete({ id: param });
    return rest;
  }
}
