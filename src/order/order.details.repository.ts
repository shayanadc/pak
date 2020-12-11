import { EntityRepository, Repository } from 'typeorm';
import { OrderDetailEntity } from './orderDetailEntity';

@EntityRepository(OrderDetailEntity)
export class OrderDetailsRepository extends Repository<OrderDetailEntity> {}
