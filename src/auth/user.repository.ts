import { LoginDto } from './login.dto';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserDto } from '../user/user.dto';
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findOrCreate(
    loginDto: LoginDto,
    identifyCode,
  ): Promise<{ newUser: boolean; user: UserEntity }> {
    let newUser = false;
    let existedUser = await this.findOne({ phone: loginDto.phone });
    if (existedUser) {
      return { user: existedUser, newUser: newUser };
    }
    newUser = true;
    let user = new UserEntity();
    user.phone = loginDto.phone;
    user.code = identifyCode;
    await user.save();

    existedUser = await this.findOne({ id: user.id });
    return { user: existedUser, newUser: newUser };
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
