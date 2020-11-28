import { ApiProperty } from '@nestjs/swagger';

export class MaterialDto {
  @ApiProperty()
  cost: string;
  @ApiProperty()
  title: string;
}
