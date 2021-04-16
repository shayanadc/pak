import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
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

  @Column({ default: 0 })
  @ApiProperty()
  priorityOrder: number;
  @Column({ default: 1 })
  @ApiProperty()
  weight: number;
  @OneToMany(
    () => OrderDetailEntity,
    details => details.material,
  )
  @ApiProperty()
  details: OrderDetailEntity[];
  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;
  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
