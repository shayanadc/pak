import { RequestType } from './request.entity';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  addressId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  date: Date;

  @ApiProperty({ enum: ['BOX', 'DISCHARGE', 'PERIODIC'] })
  // @IsEnum(RequestType)
  type: RequestType;
}
