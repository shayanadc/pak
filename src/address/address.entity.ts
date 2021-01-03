import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../auth/user.entity';
import { StateEntity } from './state.entity';
import { RequestEntity } from '../request/request.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
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
  @IsEnum(BuildingType)
  type: BuildingType;
  @ApiProperty()
  @Column({ nullable: true })
  zipCode: string;
  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;
  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
