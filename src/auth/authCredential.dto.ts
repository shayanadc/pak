import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthCredentialDTO{
  //Todo: it should follow phone numb pattern
  @IsNotEmpty()
  @IsString()
  phone: string;
  @IsNotEmpty()
  @IsNumber()
  activation_code : number
}