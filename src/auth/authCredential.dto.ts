import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialDTO {
  //Todo: it should follow phone numb pattern
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '09129120912' })
  phone: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '12345' })
  activation_code: string;
}
