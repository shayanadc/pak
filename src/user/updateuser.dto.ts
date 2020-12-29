import { Role } from '../role/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateuserDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  lname: string;
  @ApiProperty()
  disable: boolean;
  @ApiProperty({ example: ['user', 'admin'] })
  roles: Role[];
}
