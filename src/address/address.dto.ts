import { BuildingType } from './address.entity';

export class AddressDto {
  description: string;
  stateId: number;
  type: BuildingType;
}
