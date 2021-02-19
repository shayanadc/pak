import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StateService } from '../state/state.service';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../auth/user.entity';
import { StateDto } from '../state/state.dto';
import { StateEntity } from '../address/state.entity';
import { UserDto } from './user.dto';
import { MaterialUpdateDto } from '../material/material.update.dto';
import { MaterialEntity } from '../material/material.entity';
import { UpdateUserAgentDto, UpdateuserDto } from './updateuser.dto';
import { Type } from 'class-transformer';
import { BadRequestResponse } from '../api.response.swagger';
import { AllExceptionsFilter } from '../http-exception.filter';
import { skip, take } from 'rxjs/operators';
class userIdDto {
  @ApiProperty()
  id: number;
}
class UserFilterDTo {
  @ApiProperty({ example: [1, 0], required: false })
  @Type(() => Boolean)
  disable: boolean;
  @ApiProperty({ required: false })
  phone: string;
  @ApiProperty()
  take: number;
  @ApiProperty()
  skip: number;
}

class UserResponse {
  @ApiProperty()
  user: UserEntity;
}

@ApiResponse({
  status: 400,
  description: 'Missing Data',
  type: BadRequestResponse,
})
@UseFilters(AllExceptionsFilter)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiQuery({
    name: 'filters',
    required: false,
    schema: {
      items: {
        $ref: getSchemaPath(UserFilterDTo),
      },
    },
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            count: {
              type: 'string',
            },
            users: {
              type: 'array',
              items: { $ref: getSchemaPath(UserEntity) },
            },
          },
        },
      ],
    },
  })
  @UseGuards(AuthGuard())
  async index(
    @Query() query: UserFilterDTo,
  ): Promise<{ message: string; count: number; users: UserEntity[] }> {
    let take = 10;
    let skip = 0;
    if (query.hasOwnProperty('take')) {
      take = query.take;
      skip = query.skip;
      delete query.skip;
      delete query.take;
    }
    const result = await this.userService.index(query, take, skip);
    return {
      message: 'return all users',
      count: result.count,
      users: result.users,
    };
  }
  @Post('/')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponse })
  @UseGuards(AuthGuard())
  async store(
    @GetUser() user: UserEntity,
    @Body() body: UserDto,
  ): Promise<{ message: string; user: UserEntity }> {
    const cUser = await this.userService.store(body);
    return { message: 'create new user', user: cUser };
  }

  @Put('/affiliate')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponse })
  @UseGuards(AuthGuard())
  async attachAgent(
    @Body() updateUserDto: UpdateUserAgentDto,
    @GetUser() user: UserEntity,
  ): Promise<{ message: string; user: UserEntity }> {
    const updateUser = await this.userService.attachAgent(user, updateUserDto);
    return { message: 'user updated', user: updateUser };
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponse })
  @UseGuards(AuthGuard())
  // @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  async update(
    @Body() updateuserDto: UpdateuserDto,
    @Param('id', ParseIntPipe) param: userIdDto,
  ): Promise<{ message: string; user: UserEntity }> {
    const updateUser = await this.userService.update(param, updateuserDto);
    return { message: 'user updated', user: updateUser };
  }
}
