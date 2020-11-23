import { EntityRepository, Repository } from 'typeorm';
import { RequestEntity, RequestType } from './request.entity';
import { UserEntity } from '../auth/user.entity';

@EntityRepository(RequestEntity)
export class RequestRepository extends Repository<RequestEntity> {
  async getAll(user): Promise<RequestEntity[]> {
    return await this.find({
      relations: ['user'],
      where: { id: user.id },
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
    //Todo: check type 3 should have period
    request.date = body.date;
    return await request.save();
  }
  async deleteItem(user, body): Promise<void> {
    //Todo: where requset for this user
    await this.delete({ id: body.id });
  }
}
