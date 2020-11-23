import { EntityRepository, Repository } from 'typeorm';
import { RequestEntity, RequestType } from './request.entity';

@EntityRepository(RequestEntity)
export class RequestRepository extends Repository<RequestEntity> {
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
}
