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
import { AddressEntity } from './address.entity';
import { CityEntity } from './city.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity('states')
export class StateEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @Column()
  @ApiProperty()
  title: string;
  @OneToMany(
    type => AddressEntity,
    address => address.state,
  )
  @ApiProperty()
  addresses: AddressEntity[];
  @ManyToOne(
    type => CityEntity,
    city => city.states,
    { eager: true, cascade: true },
  )
  @ApiProperty()
  city: CityEntity;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;
  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
