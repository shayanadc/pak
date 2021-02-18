import { Role } from '../role/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class UpdateuserDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  lname: string;
  @ApiProperty()
  disable: boolean;
  @ApiProperty({ example: ['user', 'admin'] })
  roles: Role[];
  @ApiProperty()
  telphone: string;
  @ApiProperty()
  nationalIdNumber: string;
  @ApiProperty()
  gender?: number;
  @ApiProperty()
  birthDate: Date;
  @ApiProperty()
  bankCardNo: string;
  @ApiProperty()
  iban: string;
}
