import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AddressEntity } from './address.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../auth/user.entity';
import { AddressService } from './address.service';
import { AddressDto } from './address.dto';
import { AllExceptionsFilter } from '../http-exception.filter';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
class DeletedAddressResponse {
  @ApiProperty()
  message: string;
  @ApiProperty()
  result: string;
}
class addressResponse {
  @ApiProperty()
  message: string;
  @ApiProperty()
  address: AddressEntity;
}
class AddressIdDTO {
  @ApiProperty()
  id: number;
}
@UseFilters(AllExceptionsFilter)
@Controller('address')
export class AddressController {
  constructor(private addressServ: AddressService) {}

  @Get('/')
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            message: {
              type: 'string',
            },
            addresses: {
              type: 'array',
              items: { $ref: getSchemaPath(AddressEntity) },
            },
          },
        },
      ],
    },
  })
  @UseGuards(AuthGuard())
  async index(
    @GetUser() user: UserEntity,
  ): Promise<{ message: string; addresses: AddressEntity[] }> {
    const addresses = await this.addressServ.getAll(user);
    return { message: 'All Addresses', addresses: addresses };
  }
  @Post('/')
  @ApiBearerAuth()
  @ApiOkResponse({ type: addressResponse })
  @UseGuards(AuthGuard())
  async store(
    @GetUser() user: UserEntity,
    @Body() addressDto: AddressDto,
  ): Promise<{ message: string; address: AddressEntity }> {
    const result = await this.addressServ.store(user, addressDto);
    return { message: 'New Address Has Created', address: result };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: DeletedAddressResponse })
  @UseGuards(AuthGuard())
  async delete(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) param: AddressIdDTO,
  ): Promise<{ message: string; result: any }> {
    await this.addressServ.delete(user, param);
    return { message: 'Your Address Has Deleted', result: 'successful' };
  }
}
