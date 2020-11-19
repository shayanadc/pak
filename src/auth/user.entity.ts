import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('users')
@Unique(['phone'])
export class UserEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  phone: string
}