import { Injectable } from '@nestjs/common';
import { AddressEntity } from './address.entity';
import { AddressRepository } from './address.repository';
import { UserEntity } from '../auth/user.entity';
import { AddressDto } from './address.dto';
import { StateRepository } from './state.repository';

@Injectable()
export class AddressService {
  constructor(
    private addressRepo: AddressRepository,
    private stateRepo: StateRepository,
  ) {}
  async store(
    user: UserEntity,
    addressDto: AddressDto,
  ): Promise<AddressEntity> {
    const state = await this.stateRepo.findOneOrFail({
      id: addressDto.stateId,
    });
    return await this.addressRepo.store(user, state, addressDto);
  }
  async getAll(user: UserEntity): Promise<AddressEntity[]> {
    return await this.addressRepo.getAll(user);
  }
  async delete(user, param): Promise<void> {
    const res = await this.addressRepo.deleteItem(user, param);
    return res;
  }
}
