import { EntityRepository, getConnection, LessThan, Repository } from 'typeorm';
import { RequestEntity } from './request.entity';
import { Req } from '@nestjs/common';

@EntityRepository(RequestEntity)
export class RequestRepository extends Repository<RequestEntity> {
  async getAllFor(user): Promise<RequestEntity[]> {
    return await this.find({
      relations: ['user', 'address'],
      where: { user: user },
      order: { id: 'DESC' },
    });
  }
  async getAllWaiting(states, body): Promise<RequestEntity[]> {
    let take = 10;
    let skip = 0;
    if (body.hasOwnProperty('take')) {
      take = body.take;
      skip = body.skip;
    }
    const now = new Date();
    var result1 = this.createQueryBuilder('request')
      .leftJoinAndSelect('request.address', 'address')
      .leftJoinAndSelect('request.user', 'user')
      .leftJoinAndSelect('address.state', 'state');
    var result2 = result1
      .where('request.done = :done', { done: false })
      .andWhere('request.date <= :now', { now: now.toISOString() })
      .orderBy('state.id', 'DESC')
      .andWhere('address.stateId IN (:...stateId)', { stateId: states })
      .take(take)
      .skip(skip)
      .getMany();
    return await result2;
    // return await this.find({
    //   where: { done: false, date: LessThan(now.toISOString()) },
    //   relations: ['user', 'address'],
    //   order: { id: 'DESC' },
    // });
  }
  async store(user, address, body): Promise<RequestEntity> {
    const request = new RequestEntity();
    request.user = user;
    request.address = address;
    request.type = body.type;
    request.work_shift = body.work_shift;
    request.date = body.date;
    request.period = body.period;
    await request.save();
    return this.findOne({
      where: { id: request.id },
      relations: ['address'],
    });
  }
  async deleteItem(user, id): Promise<void> {
    await this.delete({ id: id, done: false });
  }
}
