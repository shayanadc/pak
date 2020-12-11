import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import { OrderEntity } from './order.entity';

@Entity('order_details')
export class OrderDetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  price: number;
  @Column()
  weight: number;
  @ManyToOne(
    () => OrderEntity,
    order => order.details,
  )
  order: OrderEntity;
}
