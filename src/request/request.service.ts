import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RequestRepository } from './request.repository';
import { AddressRepository } from '../address/address.repository';
import { RequestEntity } from './request.entity';
import { UpdateuserDto } from '../user/updateuser.dto';
import { UserEntity } from '../auth/user.entity';

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
    const address = await this.addressRepo.findOneOrFail({
      id: body.addressId,
    });
    const r = await this.requestRepo.findOne({
      where: { address: address, type: body.type, done: false },
    });
    if (r) {
      throw new NotFoundException(['Duplicated Request is not acceptable']);
    }
    const res = await this.requestRepo.store(user, address, body);
    return res;
  }
  async delete(user, id): Promise<void> {
    return await this.requestRepo.deleteItem(user, id);
  }

  async update(param): Promise<RequestEntity> {
    const req = await this.requestRepo.findOneOrFail({
      where: { id: param, type: 1 },
      relations: ['address'],
    });
    req.done = true;
    await req.save();

    return await this.requestRepo.findOne({
      where: { id: param },
      relations: ['address'],
    });
  }
}
