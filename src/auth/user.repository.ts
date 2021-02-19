import { LoginDto } from './login.dto';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserDto } from '../user/user.dto';
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findOrCreate(loginDto: LoginDto, identifyCode): Promise<UserEntity> {
    let user = await this.findOne({ phone: loginDto.phone });
    if (user) {
      return user;
    }

    user = new UserEntity();
    user.phone = loginDto.phone;
    user.code = identifyCode;
    await user.save();

    return this.findOne({ id: user.id });
  }

  async store(body: UserDto): Promise<UserEntity> {
    const user = new UserEntity();
    user.name = body.name;
    user.lname = body.lname;
    user.phone = body.phone;
    user.disable = body.disable;
    user.roles = body.roles;
    await user.save();
    return await this.findOne(user.id);
  }
}
