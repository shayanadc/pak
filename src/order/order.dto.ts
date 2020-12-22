import { ApiProperty } from '@nestjs/swagger';
import {
  IS_IN,
  IsArray,
  IsEnum,
  IsIn,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RequestType } from '../request/request.entity';

export class OrderDto {
  @ApiProperty()
  @IsEnum(RequestType)
  requestId: RequestType;
  @ApiProperty({ type: () => [OrderDetailsType] })
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
