import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class StateDto {
  @ApiProperty({ example: 1001 })
  @IsNumber()
  cityId: number;
  @ApiProperty({ example: 'gorgan' })
  @IsString()
  title: string;
}
