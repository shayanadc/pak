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
  PERIODIC = 3,
}
export enum WorkShiftType {
  '8-11' = 1,
  '11-16' = 2,
  '16-21' = 3,
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

  @Column({
    type: 'simple-enum',
    enum: WorkShiftType,
    default: WorkShiftType['8-11'],
  })
  work_shift: WorkShiftType;

  //todo : does not work in test
  @Column()
  date: Date;

  @Column({ nullable: true })
  period: number;

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
