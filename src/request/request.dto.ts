import { RequestType, WorkShiftType } from './request.entity';
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

  @ApiProperty({ enum: [1, 2, 3] })
  // @IsEnum(RequestType)
  type: RequestType;

  @ApiProperty({ enum: [1, 2, 3] })
  work_shift: WorkShiftType;
}
