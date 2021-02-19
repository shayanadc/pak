import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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
import { StateEntity } from '../address/state.entity';

@Entity('users')
@Unique(['phone'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @Column({ nullable: true })
  @ApiProperty()
  agentId: number;
  @Column()
  @ApiProperty()
  phone: string;
  @Column({ unique: true })
  @ApiProperty()
  code: string;
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

  @ManyToMany(
    type => StateEntity,
    state => state.users,
    { eager: true },
  )
  @JoinTable()
  states: StateEntity[];

  @Column({ nullable: true })
  telphone: string;
  @Column({ nullable: true })
  nationalIdNumber: string;
  @Column({ nullable: true })
  gender: number;
  @Column({ type: 'datetime', nullable: true })
  // @Column({ nullable: true })
  @ApiProperty()
  birthDate: Date;
  @Column({ nullable: true })
  bankCardNo: string;
  @Column({ nullable: true })
  iban: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
