import { LoginDto } from './login.dto';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserDto } from '../user/user.dto';
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findOrCreate(loginDto: LoginDto): Promise<UserEntity> {
    let user = await this.findOne({ phone: loginDto.phone });
    if (user) {
      return user;
    }

    user = new UserEntity();
    user.phone = loginDto.phone;
    await user.save();

    return user;
  }

  async store(body: UserDto): Promise<UserEntity> {
    const user = new UserEntity();
    user.name = body.name;
    user.lname = body.lname;
    user.phone = body.phone;
    user.disable = body.disable;
    await user.save();
    return user;
  }
}
