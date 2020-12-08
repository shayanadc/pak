import { Injectable } from '@nestjs/common';
import { OrderEntity } from './order.entity';
import { OrderRepository } from './order.repository';
import { OrderDto } from './order.dto';
import { RequestRepository } from '../request/request.repository';

@Injectable()
export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private requestRepo: RequestRepository,
  ) {}

  async store(user, orderDto: OrderDto): Promise<OrderEntity> {
    console.log(await this.requestRepo.find());
    const request = await this.requestRepo.findOne({ id: orderDto.requestId });
    return await this.orderRepo.store(orderDto, user, request);
  }
}
