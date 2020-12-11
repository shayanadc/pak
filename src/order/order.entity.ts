import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { RequestEntity } from '../request/request.entity';
import { UserEntity } from '../auth/user.entity';
import { OrderDetailEntity } from './orderDetailEntity';

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(type => RequestEntity)
  @JoinColumn()
  request: RequestEntity;
  @ManyToOne(
    () => UserEntity,
    user => user.orders,
  )
  user: UserEntity;
  @Column()
  price: number;
  @OneToMany(
    () => OrderDetailEntity,
    orderDetails => orderDetails.order,
  )
  details: OrderDetailEntity[];
}
