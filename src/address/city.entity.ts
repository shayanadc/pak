import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StateEntity } from './state.entity';

@Entity('cities')
export class CityEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string
  @OneToMany(type => StateEntity, state => state.city)
  states : StateEntity[]

}