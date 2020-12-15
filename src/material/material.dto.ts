import { ApiProperty } from '@nestjs/swagger';

export class MaterialDto {
  @ApiProperty()
  cost: number;
  @ApiProperty()
  title: string;
}
