import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../auth/user.entity';
import { StateEntity } from './state.entity';
import { RequestEntity } from '../request/request.entity';
import { ApiProperty } from '@nestjs/swagger';
export enum BuildingType {
  HOME = 1,
  APARTMENT = 2,
  OFFICE = 3,
}
@Entity('addresses')
export class AddressEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  description: string;
  // @ApiProperty({ type: UserEntity })
  @ManyToOne(
    type => UserEntity,
    user => user.addresses,
  )
  user: UserEntity;
  @ManyToOne(
    type => StateEntity,
    state => state.addresses,
    { eager: true },
  )
  @ApiProperty()
  state: StateEntity;
  @ApiProperty({ type: RequestEntity })
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
  @ApiProperty({ enum: ['HOME', 'APARTMENT', 'OFFICE'] })
  type: BuildingType;
}
