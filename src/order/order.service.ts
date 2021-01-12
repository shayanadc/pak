import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderEntity } from './order.entity';
import { OrderRepository } from './order.repository';
import { OrderDto } from './order.dto';
import { RequestRepository } from '../request/request.repository';
import { MaterialRepository } from '../material/material.repository';
import { OrderDetailsRepository } from './order.details.repository';
import { UserRepository } from '../auth/user.repository';
import { RequestType } from '../request/request.entity';
import { RequestService } from '../request/request.service';

@Injectable()
export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private requestRepo: RequestRepository,
    private materialRepo: MaterialRepository,
    private orderDetailRepo: OrderDetailsRepository,
    private userRepo: UserRepository,
    private reqService: RequestService,
  ) {}
  async aggregate(phone): Promise<any> {
    const user = await this.userRepo.findOneOrFail({ phone: phone });
    const orders = await this.orderRepo.find({
      relations: ['issuer'],
      where: { issuer: user, delivered: false },
    });
    if (orders.length == 0) {
      throw new NotFoundException(['You don have any order']);
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
  // async requestForSettle(user): Promise<any> {
  //   return await this.orderRepo.requestForSettle(user);
  // }
  // async settleFor(user): Promise<any> {
  //   return await this.orderRepo.settleFor(user);
  // }
  async deliveredForWith(phone): Promise<any> {
    const driver = await this.userRepo.findOneOrFail({ phone: phone });
    return await this.orderRepo.deliveredFor(driver);
  }
  async deliveredFor(driver): Promise<any> {
    return await this.orderRepo.deliveredFor(driver);
  }
  // async readyForSettle(user): Promise<OrderEntity[]> {
  //   return await this.orderRepo.findReadyForSettle(user);
  // }
  // async waitingUserForSettlemnt(): Promise<UserEntity[]> {
  //   const waitOrders = await this.orderRepo.find({
  //     where: { invoice: true, payback: false },
  //   });
  //   const ids = waitOrders.map(value => value.user.id);
  //   const waitingUsers = await this.userRepo
  //     .createQueryBuilder('users')
  //     .where('users.id IN (:...ids)', { ids: ids })
  //     .getMany();
  //   return waitingUsers;
  // }
  async getCredit(user): Promise<any> {
    const res = await this.orderRepo
      .createQueryBuilder('orders')
      .where('orders.userId = :id', { id: user.id })
      // .andWhere('orders.invoiceId = :invoiceId', { invoiceId: null })
      .andWhere('orders.invoiceId IS NULL')
      .select('SUM(orders.price)', 'sum')
      .addSelect('COUNT(orders.id)', 'count')
      .getRawOne();
    return { total: { amount: res.sum, quantity: res.count } };
  }
  async store(issuer, orderDto: OrderDto): Promise<OrderEntity> {
    const request = await this.requestRepo.findOneOrFail({
      id: orderDto.requestId,
    });
    if (request.type == RequestType.BOX || request.done) {
      throw new NotFoundException([
        'Could not create order for done or box request',
      ]);
    }
    request.done = true;
    request.save();
    if (request.type == RequestType.PERIODIC) {
      this.reqService.createNext(request);
    }
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
