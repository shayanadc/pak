import { Controller, Get, UseGuards } from '@nestjs/common';
import { AddressEntity } from './address.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../auth/user.entity';
import { AddressService } from './address.service';
import { userInfo } from 'os';

@Controller('address')
export class AddressController {
  constructor(private addressServ: AddressService) {

  }

  @Get('/')
  @UseGuards(AuthGuard())
  async index(@GetUser() user: UserEntity): Promise<AddressEntity[]>{
      return this.addressServ.getAll(user)

  }
}
