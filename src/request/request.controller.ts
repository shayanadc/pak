import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestService } from './request.service';
import { UserRepository } from '../auth/user.repository';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../auth/user.entity';
import { RequestEntity } from './request.entity';

@Controller('request')
export class RequestController {
  constructor(
    private RequestService: RequestService,
    private UserService: UserRepository,
  ) {}

  @Post('/')
  @UseGuards(AuthGuard())
  async store(
    @GetUser() user: UserEntity,
    @Body() body,
  ): Promise<{ request: RequestEntity }> {
    const req = await this.RequestService.store(user, body);
    return { request: req };
  }
}
