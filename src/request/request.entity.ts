import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { UserEntity } from '../auth/user.entity';
export enum RequestType {
  BOX = 1,
  DISCHARGE = 2,
}

@Entity('requests')
export class RequestEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'simple-enum',
    enum: RequestType,
  })
  type: RequestType;
  //todo : does not work in test
  @Column()
  date: Date;

  @ManyToOne(
    () => UserEntity,
    user => user.requests,
  )
  user: UserEntity;

  @ManyToOne(
    () => AddressEntity,
    address => address.requests,
  )
  address: AddressEntity;
}
