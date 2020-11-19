import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { UserEntity } from './user.entity';
import { AuthService } from './auth.service';
import { AuthCredentialDTO } from './authCredential.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { PhoneValidationPipe } from './phone.validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authServ : AuthService) {

  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async findOrCreateUserWithPhone(@Body('phone', PhoneValidationPipe) validPhone : string, @Body()  loginDto : LoginDto): Promise<{user: UserEntity}>{
    const user = await this.authServ.findOrCreateUserWithPhone(loginDto)
    return {user: user}
  }
  @Post('token')
  async getToken(@Body() authCredential: AuthCredentialDTO): Promise<{accessToken : string}>{
    return await this.authServ.retrieveToken(authCredential)
  }
  @Get('user')
  @UseGuards(AuthGuard())
  async getAuthUser(@GetUser() user: UserEntity): Promise<{user: UserEntity}>{
    return {user: user}
  }

}
