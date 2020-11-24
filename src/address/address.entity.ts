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
import { RequestEntity, RequestType } from '../request/request.entity';
export enum BuildingType {
  HOME = 1,
  APARTMENT = 2,
  OFFICE = 3,
}
@Entity('addresses')
export class AddressEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  description: string;
  @ManyToOne(
    type => UserEntity,
    user => user.addresses,
  )
  user: UserEntity;
  @ManyToOne(
    type => StateEntity,
    state => state.addresses,
  )
  state: StateEntity;

  @OneToMany(
    () => RequestEntity,
    request => request.address,
  )
  requests: RequestEntity[];
  @Column({
    type: 'simple-enum',
    enum: BuildingType,
    default: BuildingType.HOME,
  })
  type: BuildingType;
}
