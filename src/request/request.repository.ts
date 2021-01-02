import { EntityRepository, Repository } from 'typeorm';
import { RequestEntity } from './request.entity';

@EntityRepository(RequestEntity)
export class RequestRepository extends Repository<RequestEntity> {
  async getAllFor(user): Promise<RequestEntity[]> {
    return await this.find({
      relations: ['user', 'address'],
      where: { user: user, done: false },
    });
  }
  async getAll(): Promise<RequestEntity[]> {
    return await this.find({
      where: { done: false },
      relations: ['user'],
    });
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
