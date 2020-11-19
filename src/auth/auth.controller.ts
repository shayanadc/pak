import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LoginDTO } from './LoginDTO';
import { UserEntity } from './user.entity';
import { AuthService } from './auth.service';
import { AuthCredentialDTO } from './authCredential.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authServ : AuthService) {

  }

  @Post('login')
  async findOrCreateUserWithPhone(@Body()  loginDto : LoginDTO ): Promise<{user: UserEntity}>{
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
