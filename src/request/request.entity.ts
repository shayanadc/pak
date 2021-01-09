import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { UserEntity } from '../auth/user.entity';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  id: number;
  @Column({
    type: 'simple-enum',
    enum: RequestType,
  })
  @ApiProperty()
  type: RequestType;

  @Column({
    type: 'simple-enum',
    enum: WorkShiftType,
    default: WorkShiftType['8-11'],
  })
  @ApiProperty()
  work_shift: WorkShiftType;

  //todo : does not work in test
  @Column('datetime')
  @ApiProperty()
  date: Date;

  @Column({ nullable: true })
  @ApiProperty()
  period: number;

  @ManyToOne(
    () => UserEntity,
    user => user.requests,
    { eager: true },
  )
  @ApiProperty({ type: () => UserEntity })
  user: UserEntity;

  @ManyToOne(
    () => AddressEntity,
    address => address.requests,
  )
  @ApiProperty({ type: () => AddressEntity })
  address: AddressEntity;
  @Column({ default: false })
  @ApiProperty()
  done: boolean;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;
  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
