import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
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
    const req = await this.RequestService.store(user, body);
    return { request: req };
  }
  @Delete(':id')
  @UseGuards(AuthGuard())
  async delete(@GetUser() user: UserEntity, @Param() param): Promise<any> {
    return this.RequestService.delete(user, param);
  }
}
