import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from './LoginDTO';
import { UserEntity } from './user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authServ : AuthService) {

  }

  @Post('login')
  async findOrCreateUserWithPhone(@Body()  loginDto : LoginDTO ): Promise<{user: UserEntity}>{
    const user = await this.authServ.findOrCreateUserWithPhone(loginDto)
    return {user: user}
  }
}
