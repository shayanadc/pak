import { EntityRepository, Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderDto } from './order.dto';
import { RequestEntity } from '../request/request.entity';
import { UserEntity } from '../auth/user.entity';
import { OrderDetailEntity } from './orderDetail.entity';
import { getConnection } from 'typeorm';

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
    return order;
  }
  async index(condition?): Promise<OrderEntity[]> {
    return await this.find(condition);
  }
  async requestForSettle(user): Promise<any> {
    await getConnection()
      .createQueryBuilder()
      .update(OrderEntity)
      .set({ settleFlag: true })
      .where('userId = :id', { id: user.id })
      .execute();
  }
  async settleFor(user): Promise<any> {
    await getConnection()
      .createQueryBuilder()
      .update(OrderEntity)
      .set({ settled: true })
      .where('userId = :id', { id: user.id })
      .execute();
  }
  async deliveredFor(driver): Promise<any> {
    await getConnection()
      .createQueryBuilder()
      .update(OrderEntity)
      .set({ delivered: true })
      .where('issuerId = :id', { id: driver.id })
      .execute();
  }
  async findReadyForSettle(user): Promise<OrderEntity[]> {
    return await this.find({
      where: { user: user, settleFlag: true, settled: false },
    });
  }
}
