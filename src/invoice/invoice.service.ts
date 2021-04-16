import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../order/order.repository';
import { InvoiceRepository } from './invoice.repository';
import { InvoiceEntity } from './invoice.entity';
import { getConnection } from 'typeorm';
import { OrderEntity } from '../order/order.entity';
import * as env from 'dotenv';
env.config();
const lang = process.env.lang || 'en';
const trs = require(`../${lang}.message.json`);
@Injectable()
export class InvoiceService {
  constructor(
    private invoiceRepo: InvoiceRepository,
    private orderRepo: OrderRepository,
  ) {}
  async submitInvoice(user): Promise<InvoiceEntity> {
    const [UnPaidOrders, orderCount] = await this.orderRepo.findAndCount({
      where: { invoice: null, user: user, donate: false },
    });
    if (orderCount === 0) {
      throw new NotFoundException([
        trs.invoice.exception.submitInvoice.notAnyWaitingOrder,
      ]);
    }
    let orderIds = [];
    let ordersTotalAmount = 0;
    for (let i = 0, l = UnPaidOrders.length; i < l; i++) {
      orderIds.push(UnPaidOrders[i].id);
      ordersTotalAmount += UnPaidOrders[i].price;
    }
    if (ordersTotalAmount < parseInt(process.env.ALLOWED_PRICE_FOR_INVOICE)) {
      throw new NotFoundException([
        trs.invoice.exception.submitInvoice.notAllowedPrice,
      ]);
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
