import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../auth/user.entity';
import { StateEntity } from './state.entity';
@Entity('addresses')
export class AddressEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  description : string
  @ManyToOne(type => UserEntity, user=> user.addresses)
  user: UserEntity
  @ManyToOne(type => StateEntity, state => state.addresses)
  state: StateEntity;
}