import { Injectable } from '@nestjs/common';
import { LoginDTO } from './LoginDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserRepository) private userRepo : UserRepository) {
  }
  async findOrCreateUserWithPhone(loginDTO: LoginDTO) : Promise<UserEntity>{
    return await this.userRepo.findOrCreate(loginDTO)
  }
}
