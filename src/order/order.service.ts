import { Injectable } from '@nestjs/common';
import { OrderEntity } from './order.entity';
import { OrderRepository } from './order.repository';
import { OrderDto } from './order.dto';
import { RequestRepository } from '../request/request.repository';
import { MaterialRepository } from '../material/material.repository';
import { OrderDetailsRepository } from './order.details.repository';
import { UserRepository } from '../auth/user.repository';
import { OrderDetailEntity } from './orderDetail.entity';
import { PhoneParamDto } from './order.controller';

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
    const user = await this.userRepo.findOne({ phone: phone });
    const orders = await this.orderRepo.find({
      relations: ['issuer'],
      select: ['id'],
      where: { issuer: user },
    });
    const ids = orders.map(value => value.id);
    const details = await this.orderDetailRepo
      .createQueryBuilder('details')
      .leftJoinAndSelect('details.material', 'material')
      .select('details.materialId')
      .addSelect('SUM(details.weight)', 'weight')
      .addSelect('material.title', 'title')
      .where('details.orderId IN (:...orderIds)', { orderIds: ids })
      .groupBy('details.materialId')
      .getRawMany();
    return details;
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
    const request = await this.requestRepo.findOne({ id: orderDto.requestId });
    request.done = true;
    request.save();
    let price = 0;
    const orderDetails = [];
    for (let i = 0, l = orderDto.rows.length; i < l; i++) {
      const material = await this.materialRepo.findOne({
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
