import { RequestType } from './request.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RequestDto {
  @IsNotEmpty()
  @IsNumber()
  addressId: number;
  @IsNotEmpty()
  @IsNumber()
  date: Date;
  type: RequestType;
}
