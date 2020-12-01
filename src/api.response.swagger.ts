import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponse {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
}
