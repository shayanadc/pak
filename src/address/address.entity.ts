import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../auth/user.entity';
@Entity('addresses')
export class AddressEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  description : string
  @ManyToOne(type => UserEntity, user=> user.addresses)
  user: UserEntity
}