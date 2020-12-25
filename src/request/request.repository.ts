import { EntityRepository, Repository } from 'typeorm';
import { RequestEntity, RequestType, WorkShiftType } from './request.entity';
import { UserEntity } from '../auth/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@EntityRepository(RequestEntity)
export class RequestRepository extends Repository<RequestEntity> {
  async getAllFor(user): Promise<RequestEntity[]> {
    return await this.find({
      relations: ['user', 'address'],
      where: { user: user },
    });
  }
  async getAll(): Promise<RequestEntity[]> {
    return await this.find({
      relations: ['user'],
    });
  }
  async store(user, address, body): Promise<RequestEntity> {
    const request = new RequestEntity();
    request.user = user;
    request.address = address;
    // if (RequestType[body.type] === 'BOX') {
    request.type = body.type;
    // }
    // if (RequestType[body.type] === 'DISCHARGE') {
    //   request.type = RequestType.DISCHARGE;
    // }
    // if (RequestType[body.type] === 'PERIODIC') {
    //   request.type = RequestType.PERIODIC;
    // }
    // if (WorkShiftType[body.work_shift] === '8-11') {
    request.work_shift = body.work_shift;
    // }
    // if (WorkShiftType[body.work_shift] === '11-16') {
    //   request.work_shift = WorkShiftType['11-16'];
    // }
    // if (WorkShiftType[body.work_shift] === '16-21') {
    //   request.work_shift = WorkShiftType['16-21'];
    // }
    request.date = body.date;
    return await request.save();
  }
  async deleteItem(user, param): Promise<void> {
    await this.delete({ id: param, done: false });
  }
}
