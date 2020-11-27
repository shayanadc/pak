import { EntityRepository, Repository } from 'typeorm';
import { RequestEntity, RequestType, WorkShiftType } from './request.entity';
import { UserEntity } from '../auth/user.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(RequestEntity)
export class RequestRepository extends Repository<RequestEntity> {
  async getAll(user): Promise<RequestEntity[]> {
    return await this.find({
      relations: ['user'],
      where: { user: user },
    });
  }
  async store(user, address, body): Promise<RequestEntity> {
    const request = new RequestEntity();
    request.user = user;
    request.address = address;

    if (RequestType[body.type] === 'BOX') {
      request.type = RequestType.BOX;
    }
    if (RequestType[body.type] === 'DISCHARGE') {
      request.type = RequestType.DISCHARGE;
    }
    if (RequestType[body.type] === 'PERIODIC') {
      if (body.period == undefined) {
        throw new NotFoundException();
      }
      request.type = RequestType.PERIODIC;
    }
    if (WorkShiftType[body.work_shift] === '8-11') {
      request.work_shift = WorkShiftType['8-11'];
    }
    if (WorkShiftType[body.work_shift] === '11-16') {
      request.work_shift = WorkShiftType['11-16'];
    }
    if (WorkShiftType[body.work_shift] === '16-21') {
      request.work_shift = WorkShiftType['16-21'];
    }
    //Todo: check type 3 should have period
    request.date = body.date;
    return await request.save();
  }
  async deleteItem(user, body): Promise<void> {
    //Todo: where requset for this user
    await this.delete({ id: body.id });
  }
}
