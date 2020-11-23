import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
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
  @Get('/')
  @UseGuards(AuthGuard())
  async index(
    @GetUser() user: UserEntity,
  ): Promise<{ requests: RequestEntity[] }> {
    const req = await this.RequestService.getAll(user);
    return { requests: req };
  }
  @Post('/')
  @UseGuards(AuthGuard())
  async store(
    @GetUser() user: UserEntity,
    @Body() body,
  ): Promise<{ request: RequestEntity }> {
    try {
      const req = await this.RequestService.store(user, body);
      return { request: req };
    } catch (error) {
      console.log(error);
      throw new NotFoundException('da');
    }
  }
}
