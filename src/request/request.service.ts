import { Injectable } from '@nestjs/common';
import { RequestRepository } from './request.repository';
import { AddressRepository } from '../address/address.repository';
import { RequestEntity } from './request.entity';

@Injectable()
export class RequestService {
  constructor(
    private requestRepo: RequestRepository,
    private addressRepo: AddressRepository,
  ) {}

  async store(user, body): Promise<RequestEntity> {
    const address = await this.addressRepo.findOne({ id: body.addressId });
    return await this.requestRepo.store(user, address, body);
  }
}
