import { ApiProperty } from '@nestjs/swagger';

export class StateDto {
  @ApiProperty({ example: 1 })
  cityId: number;
  @ApiProperty({ example: 'gorgan' })
  title: string;
}
