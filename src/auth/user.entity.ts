import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { AddressEntity } from '../address/address.entity';
@Entity('users')
@Unique(['phone'])
export class UserEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  phone: string
  @OneToMany(type => AddressEntity, address => address.user)
  addresses: AddressEntity[];
}