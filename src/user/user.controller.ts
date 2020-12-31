import {
  Body,
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
import { UpdateuserDto } from './updateuser.dto';
import { Type } from 'class-transformer';
import { BadRequestResponse } from '../api.response.swagger';
import { AllExceptionsFilter } from '../http-exception.filter';
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
  async index(@Query() query: UserFilterDTo): Promise<{ users: UserEntity[] }> {
    const users = await this.userService.index(query);
    return { users: users };
  }
  @Post('/')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponse })
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
  @ApiOkResponse({ type: UserResponse })
  @UseGuards(AuthGuard())
  // @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  async update(
    @Param('id', ParseIntPipe) param: userIdDto,
    @Body() updateuserDto: UpdateuserDto,
  ): Promise<{ user: UserEntity }> {
    const updateUser = await this.userService.update(param, updateuserDto);
    return { user: updateUser };
  }
}
