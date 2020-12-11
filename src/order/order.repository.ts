import { EntityRepository, Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderDto } from './order.dto';
import { RequestEntity } from '../request/request.entity';
import { UserEntity } from '../auth/user.entity';
import { OrderDetailEntity } from './orderDetailEntity';

@EntityRepository(OrderEntity)
export class OrderRepository extends Repository<OrderEntity> {
  async store(
    orderDto: OrderDto,
    price: number,
    user: UserEntity,
    orderDetail: OrderDetailEntity[],
    request: RequestEntity,
  ): Promise<OrderEntity> {
    const order = new OrderEntity();
    order.request = request;
    order.user = user;
    order.price = price;
    order.details = orderDetail;
    return await order.save();
  }
}
