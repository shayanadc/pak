import { BuildingType } from './address.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @ApiProperty()
  stateId: number;
  @ApiProperty()
  type: BuildingType;
}
