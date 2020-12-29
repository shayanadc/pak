import { Role } from '../role/role.enum';

export class UpdateuserDto {
  name: string;
  lname: string;
  disable: boolean;
  roles: Role[];
}
