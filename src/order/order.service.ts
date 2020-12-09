import { Injectable } from '@nestjs/common';
import { OrderEntity } from './order.entity';
import { OrderRepository } from './order.repository';
import { OrderDto } from './order.dto';
import { RequestRepository } from '../request/request.repository';
import { MaterialRepository } from '../material/material.repository';

@Injectable()
export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private requestRepo: RequestRepository,
    private materialRepo: MaterialRepository,
  ) {}

  async store(user, orderDto: OrderDto): Promise<OrderEntity> {
    const request = await this.requestRepo.findOne({ id: orderDto.requestId });
    let price = 0;
    for (let i = 0, l = orderDto.rows.length; i < l; i++) {
      const mateiral = await this.materialRepo.findOne({
        id: orderDto.rows[i].materialId,
      });
      price += mateiral.cost * orderDto.rows[i].weight;
    }
    return await this.orderRepo.store(orderDto, price, user, request);
  }
}
