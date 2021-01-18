import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RequestRepository } from './request.repository';
import { AddressRepository } from '../address/address.repository';
import { RequestEntity } from './request.entity';

import * as env from 'dotenv';
env.config();
const lang = process.env.lang || 'en';
const trs = require(`../${lang}.message.json`);
@Injectable()
export class RequestService {
  constructor(
    private requestRepo: RequestRepository,
    private addressRepo: AddressRepository,
  ) {}
  async createNext(req: RequestEntity) {
    let newReq = Object.assign({}, req);
    delete newReq.id;
    const nextDate = this.calcNextTime(req.date, req.period);
    newReq.user = req.user;
    newReq.address = req.address;
    // newReq.address = req.address;
    newReq.date = nextDate;
    newReq.done = false;
    newReq = await this.requestRepo.save(newReq);
    return newReq;
  }
  calcNextTime(date, period) {
    let dateTime = new Date(date);
    const now = new Date();
    const diff = now.getDate() - dateTime.getDate();
    let days = period - diff;
    now.setDate(now.getDate() + days);
    return now;
  }
  async getAll(user?) {
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
      throw new NotFoundException([trs.request.exception.saving.duplicate]);
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
