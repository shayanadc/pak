import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDTO } from './LoginDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { AuthCredentialDTO } from './authCredential.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserRepository) private userRepo : UserRepository,
              private jwtService : JwtService) {
  }
  async findOrCreateUserWithPhone(loginDTO: LoginDTO) : Promise<UserEntity>{
    return await this.userRepo.findOrCreate(loginDTO)
  }
  async retrieveToken(authCredential : AuthCredentialDTO): Promise<{accessToken: string}>{
    const user = await this.userRepo.findOne({phone: authCredential.phone})
    if(!user){
      throw new NotFoundException('User Not Found')
    }
    const payload: JwtPayload = authCredential;
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
