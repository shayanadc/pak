import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto{
  @IsNotEmpty()
  @IsString()
  phone: string
}