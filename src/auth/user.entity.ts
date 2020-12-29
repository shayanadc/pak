import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { RequestEntity } from '../request/request.entity';
import { ApiProperty } from '@nestjs/swagger';
import { OrderEntity } from '../order/order.entity';
import { Role } from '../role/role.enum';
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
  @Column({ nullable: true })
  @ApiProperty()
  name: string;
  @Column({ nullable: true })
  @ApiProperty()
  lname: string;
  @Column({ default: false })
  @ApiProperty()
  disable: boolean;
  @Column('simple-array', { default: Role.Admin })
  @ApiProperty()
  roles: string[];
}
