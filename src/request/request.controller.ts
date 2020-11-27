import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestService } from './request.service';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../auth/user.entity';
import { RequestEntity } from './request.entity';
import { RequestDto } from './request.dto';
import { AllExceptionsFilter } from '../http-exception.filter';
@UseFilters(AllExceptionsFilter)
@Controller('request')
export class RequestController {
  constructor(private RequestService: RequestService) {}
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
    @Body() body: RequestDto,
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
