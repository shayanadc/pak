import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { RequestRepository } from './request.repository';
import { AddressRepository } from '../address/address.repository';
import { RequestEntity } from './request.entity';

@Injectable()
export class RequestService {
  constructor(
    private requestRepo: RequestRepository,
    private addressRepo: AddressRepository,
  ) {}
  async getAll(user) {
    if (user) {
      return await this.requestRepo.getAllFor(user);
    }
    return await this.requestRepo.getAll();
  }
  async store(user, body): Promise<RequestEntity> {
    const r = await this.requestRepo.findOne({
      where: { user: user, type: body.type },
    });
    if (r) {
      throw new BadRequestException('Duplicated Request is not acceptable');
    }
    const address = await this.addressRepo.findOne({ id: body.addressId });
    const res = await this.requestRepo.store(user, address, body);
    return res;
  }
  async delete(user, body): Promise<void> {
    return await this.requestRepo.deleteItem(user, body);
  }
}
