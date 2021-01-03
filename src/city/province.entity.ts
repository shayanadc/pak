import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StateEntity } from '../address/state.entity';
import { CityEntity } from '../address/city.entity';

@Entity('provinces')
export class ProvinceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @ApiProperty()
  @Column()
  name: string;
  @OneToMany(
    type => CityEntity,
    city => city.province,
  )
  @ApiProperty()
  cities: CityEntity[];
  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;
  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
