import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { RequestEntity } from '../request/request.entity';
import { ApiProperty } from '@nestjs/swagger';
import { OrderEntity } from '../order/order.entity';
import { Role } from '../role/role.enum';
import { Exclude } from 'class-transformer';
import { InvoiceEntity } from '../invoice/invoice.entity';

@Entity('users')
@Unique(['phone'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @Column()
  @ApiProperty()
  phone: string;
  @OneToMany(
    type => AddressEntity,
    address => address.user,
  )
  @ApiProperty()
  addresses: AddressEntity[];
  @OneToMany(
    () => RequestEntity,
    request => request.user,
  )
  @ApiProperty()
  requests: RequestEntity[];

  @OneToMany(
    () => OrderEntity,
    order => order.user,
  )
  @ApiProperty()
  orders: OrderEntity[];

  @OneToMany(
    () => InvoiceEntity,
    invoice => invoice.user,
  )
  @ApiProperty()
  invoices: InvoiceEntity[];

  @Column({ nullable: true })
  @ApiProperty()
  name: string;
  @Column({ nullable: true })
  @ApiProperty()
  lname: string;
  @Column({ default: false })
  @ApiProperty()
  disable: boolean;
  @Column('simple-array', { default: Role.User })
  @ApiProperty()
  roles: string[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
