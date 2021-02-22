import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from './login.dto';
import { UserEntity } from './user.entity';
import { AuthService } from './auth.service';
import { AuthCredentialDTO } from './authCredential.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { PhoneValidationPipe } from './phone.validation.pipe';
import { AllExceptionsFilter } from '../http-exception.filter';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { BadRequestResponse } from '../api.response.swagger';
import { OrderService } from '../order/order.service';
import { Roles } from '../role/role.decorator';
import { Role } from '../role/role.enum';
import { RolesGuard } from '../role/roles.guard';
import { IsOptional } from 'class-validator';

class AmountType {
  @ApiProperty({ example: 2000 })
  amount: number;
  @ApiProperty()
  quantity: number;
}
class CreditType {
  @ApiProperty()
  total: AmountType;
}
class userLoginResponse {
  @ApiProperty()
  message: string;
  @ApiProperty()
  user: UserEntity;
  @ApiProperty()
  newUser: boolean;
}
class userResponse {
  @ApiProperty()
  message: string;
  @ApiProperty()
  user: UserEntity;
  @ApiProperty()
  credit: CreditType;
}

class creditFilterDto {
  @ApiProperty()
  @IsOptional()
  donate: boolean;
}

class apiToken {
  @ApiProperty()
  message: string;
  @ApiProperty()
  token: string;
}

@UseFilters(AllExceptionsFilter)
@Controller('auth')
@ApiResponse({
  status: 400,
  description: 'Missing Data',
  type: BadRequestResponse,
})
export class AuthController {
  constructor(private authServ: AuthService, private orderServ: OrderService) {}

  @Post('login')
  @ApiOkResponse({ type: userLoginResponse })
  @UsePipes(ValidationPipe)
  async findOrCreateUserWithPhone(
    @Body('phone', PhoneValidationPipe) validPhone: string,
    @Body() loginDto: LoginDto,
  ): Promise<{ message: string; user: UserEntity; newUser: boolean }> {
    const result = await this.authServ.findOrCreateUserWithPhone(loginDto);
    return {
      message: 'the activation code sent for your customer',
      user: result.user,
      newUser: result.newUser,
    };
  }
  @Post('token')
  @ApiOkResponse({ type: apiToken })
  async getToken(
    @Body() authCredential: AuthCredentialDTO,
  ): Promise<{ message: string; accessToken: string }> {
    const { accessToken } = await this.authServ.retrieveToken(authCredential);
    return {
      message: 'return access token',
      accessToken: accessToken,
    };
  }

  @Get('user')
  @ApiBearerAuth()
  @ApiOkResponse({ type: userResponse })
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.User, Role.Admin, Role.Driver, Role.Keeper)
  async getAuthUser(
    @GetUser() user: UserEntity,
    @Query() query: creditFilterDto,
  ): Promise<userResponse> {
    return {
      message: 'current user',
      user: user,
      credit: await this.orderServ.getCredit(user, query),
    };
  }
}
