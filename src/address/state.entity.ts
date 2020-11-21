import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../auth/user.entity';
import { AddressEntity } from './address.entity';
import { CityEntity } from './city.entity';
@Entity('states')
export class StateEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title : string
  @OneToMany(type => AddressEntity, address => address.state)
  addresses: AddressEntity[]
  @ManyToOne(type => CityEntity, city=> city.states)
  city : CityEntity
}