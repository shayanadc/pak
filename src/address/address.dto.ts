import { BuildingType } from './address.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty()
  description: string;
  @ApiProperty()
  stateId: number;
  @ApiProperty()
  type: BuildingType;
}
