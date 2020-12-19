import { RequestType, WorkShiftType } from './request.entity';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  addressId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @ApiProperty({ enum: [1, 2, 3] })
  @IsEnum(RequestType)
  type: RequestType;

  @ApiProperty({ enum: [1, 2, 3] })
  @IsEnum(WorkShiftType)
  work_shift: WorkShiftType;
}
