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
  isCodeMatch(authCredential : AuthCredentialDTO){
    //Todo : find any activation code for this phone number
    //Todo : delete after retrieve
    return true
  }
  async retrieveToken(authCredential : AuthCredentialDTO): Promise<{accessToken: string}>{
    const user = await this.userRepo.findOne({phone: authCredential.phone})
    if(!user || !this.isCodeMatch(authCredential)){
      throw new NotFoundException('User Not Found')
    }
    const payload: JwtPayload = authCredential;
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
