import { BuildingType } from './address.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import * as env from 'dotenv';
env.config();
const lang = process.env.lang || 'en';
const trs = require(`../${lang}.message.json`);

export class AddressDto {
  @ApiProperty()
  @IsNotEmpty({ message: trs.address.validation.description.isNotEmpty })
  @IsString({ message: trs.address.validation.description.isString })
  description: string;
  @IsNotEmpty({ message: trs.address.validation.stateId.isNotEmpty })
  @ApiProperty()
  stateId: number;
  @ApiProperty()
  @IsEnum(BuildingType)
  type: BuildingType;
  @ApiProperty()
  @IsOptional()
  zipCode: string;
}
