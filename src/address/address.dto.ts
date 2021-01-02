import { BuildingType } from './address.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @ApiProperty()
  stateId: number;
  @ApiProperty()
  @IsEnum(BuildingType)
  type: BuildingType;
  @ApiProperty()
  @IsOptional()
  zipCode: string;
}
