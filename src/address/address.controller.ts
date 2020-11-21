import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AddressEntity } from './address.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../auth/user.entity';
import { AddressService } from './address.service';
import { AddressDto } from './address.dto';

@Controller('address')
export class AddressController {
  constructor(private addressServ: AddressService) {
  }

  @Get('/')
  @UseGuards(AuthGuard())
  async index(@GetUser() user: UserEntity): Promise<AddressEntity[]>{
      return this.addressServ.getAll(user)

  }
  @Post('/')
  @UseGuards(AuthGuard())
  async store(@GetUser() user: UserEntity, @Body() addressDto: AddressDto): Promise<{address: AddressEntity}>{
    const result = await this.addressServ.store(user,addressDto)
    return {address: result}
  }
}
