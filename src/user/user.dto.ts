import { Role } from '../role/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  lname: string;
  @ApiProperty()
  @MinLength(11)
  @MaxLength(11)
  phone: string;
  @ApiProperty()
  @IsOptional()
  disable: boolean;
  @ApiProperty({ example: ['user', 'admin'] })
  roles: Role[];
}
