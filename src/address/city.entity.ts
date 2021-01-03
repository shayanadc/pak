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
  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;
  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
