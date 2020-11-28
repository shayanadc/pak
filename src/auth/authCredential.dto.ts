import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialDTO {
  //Todo: it should follow phone numb pattern
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phone: string;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  activation_code: string;
}
