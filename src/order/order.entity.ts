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
import { OrderDetailEntity } from './orderDetail.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @OneToOne(type => RequestEntity)
  @JoinColumn()
  @ApiProperty()
  request: RequestEntity;
  @ManyToOne(
    () => UserEntity,
    user => user.orders,
    { eager: true },
  )
  user: UserEntity;

  @ManyToOne(
    () => UserEntity,
    issuer => issuer.orders,
    { eager: true },
  )
  issuer: UserEntity;

  @Column()
  @ApiProperty()
  price: number;
  @OneToMany(
    () => OrderDetailEntity,
    orderDetails => orderDetails.order,
  )
  details: OrderDetailEntity[];
}
