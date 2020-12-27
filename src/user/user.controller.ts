import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { StateService } from '../state/state.service';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../auth/user.entity';
import { StateDto } from '../state/state.dto';
import { StateEntity } from '../address/state.entity';
import { UserDto } from './user.dto';
import { MaterialUpdateDto } from '../material/material.update.dto';
import { MaterialEntity } from '../material/material.entity';
import { UpdateuserDto } from './updateuser.dto';
class userIdDto {
  @ApiProperty()
  id: number;
}
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

  @Put(':id')
  @ApiBearerAuth()
  // @ApiOkResponse({ type: materialResponse })
  @UseGuards(AuthGuard())
  // @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  async update(
    @Param('id', ParseIntPipe) param: userIdDto,
    @Body()
    updateuserDto: UpdateuserDto,
  ): Promise<{ user: UserEntity }> {
    const updateUser = await this.userService.update(param, updateuserDto);
    return { user: updateUser };
  }
}
