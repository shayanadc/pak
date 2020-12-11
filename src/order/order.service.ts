import { Injectable } from '@nestjs/common';
import { OrderEntity } from './order.entity';
import { OrderRepository } from './order.repository';
import { OrderDto } from './order.dto';
import { RequestRepository } from '../request/request.repository';
import { MaterialRepository } from '../material/material.repository';
import { OrderDetailsRepository } from './order.details.repository';

@Injectable()
export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private requestRepo: RequestRepository,
    private materialRepo: MaterialRepository,
    private orderDetailRepo: OrderDetailsRepository,
  ) {}
  async index(condition?): Promise<OrderEntity[]> {
    return await this.orderRepo.index(condition);
  }
  async getCredit(user): Promise<any> {
    const { sum } = await this.orderRepo
      .createQueryBuilder('orders')
      .where('userId = :id', { id: user.id })
      .select('SUM(orders.price)', 'sum')
      .getRawOne();
    return { total: { amount: sum } };
  }
  async store(issuer, orderDto: OrderDto): Promise<OrderEntity> {
    const request = await this.requestRepo.findOne({ id: orderDto.requestId });
    request.done = true;
    request.save();
    let price = 0;
    const orderDetails = [];
    for (let i = 0, l = orderDto.rows.length; i < l; i++) {
      const mateiral = await this.materialRepo.findOne({
        id: orderDto.rows[i].materialId,
      });
      orderDetails.push(
        await this.orderDetailRepo.save({
          price: mateiral.cost * orderDto.rows[i].weight,
          weight: orderDto.rows[i].weight,
        }),
      );
      price += mateiral.cost * orderDto.rows[i].weight;
    }
    return await this.orderRepo.store(
      orderDto,
      price,
      request.user,
      issuer,
      orderDetails,
      request,
    );
  }
}
