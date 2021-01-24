import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as env from 'dotenv';
env.config();
const lang = process.env.lang || 'en';
const trs = require(`../${lang}.message.json`);

export class AuthCredentialDTO {
  //Todo: it should follow phone numb pattern
  @IsNotEmpty({ message: trs.auth.validation.phone.isNotEmpty })
  @IsString({ message: trs.auth.validation.phone.isString })
  @ApiProperty({ example: '09129120912' })
  phone: string;
  @IsNotEmpty({ message: trs.auth.validation.activationCode.isNotEmpty })
  @IsString({ message: trs.auth.validation.activationCode.isString })
  @ApiProperty({ example: '12345' })
  activation_code: string;
}
