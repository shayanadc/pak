import { EntityRepository, Repository } from 'typeorm';
import { OrderDetailEntity } from './orderDetail.entity';

@EntityRepository(OrderDetailEntity)
export class OrderDetailsRepository extends Repository<OrderDetailEntity> {}
