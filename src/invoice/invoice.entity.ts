import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from '../address/city.entity';
import { OrderEntity } from '../order/order.entity';
import { ProvinceEntity } from '../city/province.entity';
import { UserEntity } from '../auth/user.entity';

@Entity('invoices')
export class InvoiceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @Column()
  @ApiProperty()
  amount: number;
  @Column({ default: false })
  @ApiProperty()
  payback: boolean;
  @OneToMany(
    type => OrderEntity,
    order => order.invoice,
  )
  @ApiProperty()
  orders: OrderEntity[];

  @ManyToOne(
    () => UserEntity,
    user => user.invoices,
  )
  @ApiProperty({ type: () => UserEntity })
  user: UserEntity;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;
  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
