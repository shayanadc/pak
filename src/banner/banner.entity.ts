import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('banners')
export class BannerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @ApiProperty()
  @Column()
  title: string;
  @ApiProperty()
  @Column()
  url: string;
  @ApiProperty()
  @Column()
  link: string;
}
