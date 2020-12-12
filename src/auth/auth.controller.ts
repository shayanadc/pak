import {
  Body,
  Controller,
  Get,
  Header,
  Post,
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
  ApiHeader,
  ApiOkResponse,
  ApiProperty,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { BadRequestResponse } from '../api.response.swagger';
import { OrderService } from '../order/order.service';
class AmountType {
  @ApiProperty({ example: 2000 })
  amount: number;
}
class CreditType {
  @ApiProperty()
  total: AmountType;
}
class userResponse {
  @ApiProperty()
  user: UserEntity;
  @ApiProperty()
  credit: CreditType;
}

class apiToken {
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
  @ApiOkResponse({ type: userResponse })
  @UsePipes(ValidationPipe)
  async findOrCreateUserWithPhone(
    @Body('phone', PhoneValidationPipe) validPhone: string,
    @Body() loginDto: LoginDto,
  ): Promise<{ user: UserEntity }> {
    const user = await this.authServ.findOrCreateUserWithPhone(loginDto);
    return { user: user };
  }
  @Post('token')
  @ApiOkResponse({ type: apiToken })
  async getToken(
    @Body() authCredential: AuthCredentialDTO,
  ): Promise<{ accessToken: string }> {
    return await this.authServ.retrieveToken(authCredential);
  }

  @Get('user')
  @ApiBearerAuth()
  @ApiOkResponse({ type: userResponse })
  @UseGuards(AuthGuard())
  async getAuthUser(@GetUser() user: UserEntity): Promise<userResponse> {
    return { user: user, credit: await this.orderServ.getCredit(user) };
  }
}
