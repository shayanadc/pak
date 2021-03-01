import { BadRequestException, Injectable } from '@nestjs/common';
import { StateRepository } from '../address/state.repository';
import { CityRepository } from '../address/city.repository';
import { UserRepository } from '../auth/user.repository';
import { UserEntity } from '../auth/user.entity';
import { UserDto } from './user.dto';
import { UpdateuserDto } from './updateuser.dto';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}
  async index(
    query,
    take = 10,
    skip = 0,
  ): Promise<{ count: number; users: UserEntity[] }> {
    const [result, count] = await this.userRepo.findAndCount({
      where: query,
      take: take,
      skip: skip,
      order: { id: 'ASC' },
    });

    return { count: count, users: result };
  }
  async store(body: UserDto): Promise<UserEntity> {
    return await this.userRepo.store(body);
  }

  async attachAgent(user, body): Promise<UserEntity> {
    if (user.agentId) {
      throw new BadRequestException('this user has agent');
    }
    const userAgent = await this.userRepo.findOneOrFail({
      code: body.agentCode,
    });
    user.agentId = userAgent.id;
    await user.save();
    return await this.userRepo.findOne({ id: user.id });
  }
  async update(param, body: UpdateuserDto): Promise<UserEntity> {
    await this.userRepo.findOneOrFail({ id: param });
    await this.userRepo.save({ ...body, id: param });
    return await this.userRepo.findOne({ id: param });
  }
}
