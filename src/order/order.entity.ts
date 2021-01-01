import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
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
  @ApiProperty({ type: () => UserEntity })
  user: UserEntity;

  @ManyToOne(
    () => UserEntity,
    issuer => issuer.orders,
    { eager: true },
  )
  @ApiProperty({ type: () => UserEntity })
  issuer: UserEntity;

  @Column()
  @ApiProperty()
  price: number;
  @OneToMany(
    () => OrderDetailEntity,
    orderDetails => orderDetails.order,
  )
  @ApiProperty()
  details: OrderDetailEntity[];

  @CreateDateColumn({ select: false })
  createdAt: Date;
  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
