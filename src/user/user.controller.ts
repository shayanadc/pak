import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { StateService } from '../state/state.service';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../auth/user.entity';
import { StateDto } from '../state/state.dto';
import { StateEntity } from '../address/state.entity';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/')
  @ApiBearerAuth()
  // @ApiOkResponse({ type: StateResponse })
  @UseGuards(AuthGuard())
  async store(
    @GetUser() user: UserEntity,
    @Body() body: UserDto,
  ): Promise<{ user: UserEntity }> {
    const cUser = await this.userService.store(body);
    return { user: cUser };
  }
}
