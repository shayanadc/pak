import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
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
  @OneToOne(() => AddressEntity)
  @JoinColumn()
  address: AddressEntity;
  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
  @Column({
    type: 'simple-enum',
    enum: RequestType,
  })
  type: RequestType;
  //todo : does not work in test
  @Column()
  date: Date;
}
