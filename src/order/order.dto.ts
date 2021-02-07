import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IS_IN,
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderDto {
  @ApiProperty()
  @IsNotEmpty()
  requestId: number;
  @ApiProperty({ type: () => [OrderDetailsType] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailsType)
  rows: OrderDetailsType[];
  @ApiPropertyOptional()
  @IsOptional()
  donate: boolean;
}
class OrderDetailsType {
  @ApiProperty()
  @IsNumber()
  weight: number;
  @ApiProperty()
  @IsNumber()
  materialId: number;
}
