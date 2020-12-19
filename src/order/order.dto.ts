import { ApiProperty } from '@nestjs/swagger';
import {
  IS_IN,
  IsArray,
  IsIn,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import any = jasmine.any;
import { type } from 'os';

export class OrderDto {
  @ApiProperty()
  @IsNumber()
  requestId: number;
  @ApiProperty({ type: () => OrderDetailsType })
  @ValidateNested({ each: true })
  @Type(() => OrderDetailsType)
  rows: OrderDetailsType[];
}
class OrderDetailsType {
  @ApiProperty()
  @IsNumber()
  weight: number;
  @ApiProperty()
  @IsNumber()
  materialId: number;
}
