import {
  HttpException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { OrderEntity } from './order.entity';
import { OrderRepository } from './order.repository';
import { OrderDto } from './order.dto';
import { RequestRepository } from '../request/request.repository';
import { MaterialRepository } from '../material/material.repository';
import { OrderDetailsRepository } from './order.details.repository';
import { UserRepository } from '../auth/user.repository';
import { RequestType } from '../request/request.entity';
import { getManager } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private requestRepo: RequestRepository,
    private materialRepo: MaterialRepository,
    private orderDetailRepo: OrderDetailsRepository,
    private userRepo: UserRepository,
  ) {}
  async aggregate(phone): Promise<any> {
    const user = await this.userRepo.findOneOrFail({ phone: phone });
    const orders = await this.orderRepo.find({
      relations: ['issuer'],
      where: { issuer: user },
    });
    if (orders.length == 0) {
      throw new NotFoundException('You don have any order');
    }
    const ids = orders.map(value => value.id);
    const agg = await this.orderDetailRepo
      .createQueryBuilder('details')
      .select('details.orderId')
      .select('details.materialId')
      // .leftJoinAndSelect('material', 'material')
      .addSelect('SUM(details.weight)', 'weight')
      // .addSelect('material.title', 'title')
      .where('details.orderId IN (:...orderIds)', { orderIds: ids })
      .groupBy('details.materialId')
      .getRawMany();
    const x = agg;
    for (let i = 0, l = x.length; i < l; i++) {
      const matObject = await this.materialRepo.findOne({
        id: x[i].materialId,
        // select: ['title'],
      });
      x[i].title = matObject.title;
      x[i].weight = parseFloat(x[i].weight);
    }
    return x;
  }
  async index(condition?): Promise<OrderEntity[]> {
    return await this.orderRepo.index(condition);
  }
  async getCredit(user): Promise<any> {
    const { sum } = await this.orderRepo
      .createQueryBuilder('orders')
      .where('orders.userId = :id', { id: user.id })
      .select('SUM(orders.price)', 'sum')
      .getRawOne();
    return { total: { amount: sum } };
  }
  async store(issuer, orderDto: OrderDto): Promise<OrderEntity> {
    const request = await this.requestRepo.findOneOrFail({
      id: orderDto.requestId,
    });
    if (request.type == RequestType.BOX || request.done) {
      throw new Error('Could not create order for this request');
    }
    request.done = true;
    request.save();
    let price = 0;
    const orderDetails = [];
    for (let i = 0, l = orderDto.rows.length; i < l; i++) {
      const material = await this.materialRepo.findOneOrFail({
        id: orderDto.rows[i].materialId,
      });
      orderDetails.push(
        await this.orderDetailRepo.save({
          price: material.cost * orderDto.rows[i].weight,
          weight: orderDto.rows[i].weight,
          material: material,
        }),
      );
      price += material.cost * orderDto.rows[i].weight;
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
