import { LoginDTO } from './LoginDTO';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity>{

  async findOrCreate(loginDto : LoginDTO): Promise<UserEntity>{
    let  user = await this.findOne({phone: loginDto.phone})
    if(user) {return user}

    user = new UserEntity();
    user.phone = loginDto.phone
    await user.save()

    return user
  }
}