import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StateEntity } from './state.entity';
import { ApiProperty } from '@nestjs/swagger';

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
}
