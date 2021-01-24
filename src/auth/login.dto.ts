import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as env from 'dotenv';
env.config();
const lang = process.env.lang || 'en';
const trs = require(`../${lang}.message.json`).login;
export class LoginDto {
  @IsNotEmpty({ message: trs.validation.phone.isNotEmpty })
  @IsString({ message: trs.validation.phone.isNotString })
  @ApiProperty()
  phone: string;
}
