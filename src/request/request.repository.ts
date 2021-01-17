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
  async getAll(): Promise<RequestEntity[]> {
    const now = new Date();
    return await this.createQueryBuilder('request')
      .where('request.done = :done', { done: false })
      .andWhere('request.date <= :now', { now: now.toISOString() })
      .leftJoinAndSelect('request.user', 'user')
      .leftJoinAndSelect('request.address', 'address')
      .where('address.stateId = :stateId', { stateId: 1 })
      // .addSelect('COUNT(orders.id)', 'count')
      .getRawMany();
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
