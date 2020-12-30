import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StateEntity } from './state.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProvinceEntity } from '../city/province.entity';

@Entity('cities')
export class CityEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @Column()
  @ApiProperty()
  name: string;
  @OneToMany(
    type => StateEntity,
    state => state.city,
  )
  @ApiProperty()
  states: StateEntity[];
  @ManyToOne(
    type => ProvinceEntity,
    province => province.cities,
    { eager: true },
  )
  province: ProvinceEntity;
}
