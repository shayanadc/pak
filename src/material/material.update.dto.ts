import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MaterialUpdateDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  cost: number;
  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;
}
