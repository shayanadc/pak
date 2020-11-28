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
}
