import { EntityRepository, Repository } from 'typeorm';
import { AddressEntity, BuildingType } from './address.entity';
import { UserEntity } from '../auth/user.entity';
import { AddressDto } from './address.dto';
import { StateEntity } from './state.entity';
import { RequestType } from '../request/request.entity';

@EntityRepository(AddressEntity)
export class AddressRepository extends Repository<AddressEntity> {
  async getAll(user: UserEntity): Promise<AddressEntity[]> {
    return await this.find({
      relations: ['user'],
      where: { id: user.id },
    });
  }
  async store(
    user: UserEntity,
    state: StateEntity,
    addressDto: AddressDto,
  ): Promise<AddressEntity> {
    const address = new AddressEntity();
    address.description = addressDto.description;
    address.user = user;
    address.state = state;
    let type = BuildingType.OFFICE;
    if (BuildingType[addressDto.type] === 'HOME') {
      type = BuildingType.HOME;
    }
    if (BuildingType[addressDto.type] === 'APARTMENT') {
      type = BuildingType.APARTMENT;
    }
    address.type = type;
    await address.save();
    return address;
  }
}
