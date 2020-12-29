import { Role } from '../role/role.enum';

export class UserDto {
  name: string;
  lname: string;
  phone: string;
  disable: boolean;
  roles: Role[];
}
