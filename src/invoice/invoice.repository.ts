import { EntityRepository, Repository } from 'typeorm';
import { InvoiceEntity } from './invoice.entity';

@EntityRepository(InvoiceEntity)
export class InvoiceRepository extends Repository<InvoiceEntity> {
  async index(condition?): Promise<InvoiceEntity[]> {
    return await this.find(condition);
  }
}
