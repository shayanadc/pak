import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import * as env from 'dotenv';
env.config();
const lang = process.env.lang || 'en';
const trs = require(`../${lang}.message.json`);

export class MaterialDto {
  @ApiProperty()
  @IsNumber()
  cost: number;
  @ApiProperty()
  @IsString({ message: trs.material.validation.title.isString })
  title: string;
}
