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

class userResponse {
  @ApiProperty()
  user: UserEntity;
}
class apiToken {
  @ApiProperty()
  token: string;
}

@UseFilters(AllExceptionsFilter)
@Controller('auth')
export class AuthController {
  constructor(private authServ: AuthService) {}

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
    return { user: user };
  }
}
