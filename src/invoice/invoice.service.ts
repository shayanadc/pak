import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../order/order.repository';
import { InvoiceRepository } from './invoice.repository';
import { InvoiceEntity } from './invoice.entity';
import { getConnection } from 'typeorm';
import { OrderEntity } from '../order/order.entity';

@Injectable()
export class InvoiceService {
  constructor(
    private invoiceRepo: InvoiceRepository,
    private orderRepo: OrderRepository,
  ) {}
  async submitInvoice(user): Promise<InvoiceEntity> {
    const UnPaidOrders = await this.orderRepo.find({
      where: { invoice: null, user: user },
    });
    if (!UnPaidOrders) {
      throw new NotFoundException('there is not any waiting orders');
    }
    let orderIds = [];
    let ordersTotalAmount = 0;
    for (let i = 0, l = UnPaidOrders.length; i < l; i++) {
      orderIds.push(UnPaidOrders[i].id);
      ordersTotalAmount += UnPaidOrders[i].price;
    }

    const invoice = new InvoiceEntity();
    invoice.amount = ordersTotalAmount;
    invoice.user = user;
    await invoice.save();
    await getConnection()
      .createQueryBuilder()
      .update(OrderEntity)
      .set({ invoice: invoice })
      .where('id IN (:...ids)', { ids: orderIds })
      .execute();
    return invoice;
  }

  async index(condition?): Promise<InvoiceEntity[]> {
    return await this.invoiceRepo.index(condition);
  }
}
