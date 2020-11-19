import { LoginDTO } from './LoginDTO';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity>{

  async findOrCreate(loginDto : LoginDTO): Promise<UserEntity>{
    const user = new UserEntity();
    user.phone = loginDto.phone
    await user.save()
    return user
  }
}