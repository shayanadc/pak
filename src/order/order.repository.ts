import { EntityRepository, Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderDto } from './order.dto';
import { RequestEntity } from '../request/request.entity';
import { UserEntity } from '../auth/user.entity';
import { OrderDetailEntity } from './orderDetail.entity';

@EntityRepository(OrderEntity)
export class OrderRepository extends Repository<OrderEntity> {
  async store(
    orderDto: OrderDto,
    price: number,
    user: UserEntity,
    issuer: UserEntity,
    orderDetail: OrderDetailEntity[],
    request: RequestEntity,
  ): Promise<OrderEntity> {
    const order = new OrderEntity();
    order.request = request;
    order.user = user;
    order.issuer = issuer;
    order.price = price;
    order.details = orderDetail;
    await order.save();
    await delete order.createdAt;
    await delete order.updatedAt;
    await delete order.request.createdAt;
    await delete order.request.updatedAt;
    return order;
  }
  async index(condition?): Promise<OrderEntity[]> {
    return await this.find(condition);
  }
}
