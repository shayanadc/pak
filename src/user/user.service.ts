import { Injectable } from '@nestjs/common';
import { StateRepository } from '../address/state.repository';
import { CityRepository } from '../address/city.repository';
import { UserRepository } from '../auth/user.repository';
import { UserEntity } from '../auth/user.entity';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}
  async store(body: UserDto): Promise<UserEntity> {
    return await this.userRepo.store(body);
  }
}
