import { EntityRepository, Repository } from 'typeorm';
import { RequestEntity } from './request.entity';

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
    request.type = body.type;
    request.work_shift = body.work_shift;
    request.date = body.date;
    return await request.save();
  }
  async deleteItem(user, param): Promise<void> {
    await this.delete({ id: param, done: false });
  }
}
