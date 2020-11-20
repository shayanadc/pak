import { Injectable } from '@nestjs/common';
import { AddressEntity } from './address.entity';
import { AddressRepository } from './address.repository';
import { UserEntity } from '../auth/user.entity';

@Injectable()
export class AddressService {
  constructor(private addressRepo : AddressRepository) {
  }

  async getAll(user: UserEntity) : Promise<AddressEntity[]>{
    return this.addressRepo.getAll(user)
  }
}
