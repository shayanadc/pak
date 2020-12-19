import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MaterialDto {
  @ApiProperty()
  @IsNumber()
  cost: number;
  @ApiProperty()
  @IsString()
  title: string;
}
