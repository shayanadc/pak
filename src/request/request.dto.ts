import { RequestType, WorkShiftType } from './request.entity';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as env from 'dotenv';
env.config();
const lang = process.env.lang || 'en';
const trs = require(`../${lang}.message.json`);
export class RequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  addressId: number;

  @ApiProperty()
  @IsNotEmpty({ message: trs.request.validation.date.isNotEmpty })
  @IsDateString({ message: trs.request.validation.date.isDateString })
  date: Date;

  @ApiProperty({ enum: [1, 2, 3] })
  @IsEnum(RequestType)
  type: RequestType;

  @ApiProperty({ enum: [1, 2, 3] })
  @IsEnum(WorkShiftType)
  work_shift: WorkShiftType;
  // @ValidateIf(o => RequestType[o.type] == 'PERIODIC')
  // @IsNotEmpty({ message: trs.request.validation.period.isNotEmpty })
  @ApiProperty()
  period: number;
}
