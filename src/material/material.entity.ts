import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderDetailEntity } from '../order/orderDetail.entity';

@Entity('materials')
@Unique(['title'])
export class MaterialEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @Column()
  @ApiProperty()
  title: string;
  @Column()
  @ApiProperty()
  cost: number;
  @Column({ default: 1 })
  @ApiProperty()
  weight: number;
  @OneToMany(
    () => OrderDetailEntity,
    details => details.material,
  )
  details: OrderDetailEntity[];
}
