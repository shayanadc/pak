import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StateEntity } from '../address/state.entity';
import { StateService } from './state.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { BadRequestResponse } from '../api.response.swagger';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../auth/user.entity';
import { StateDto } from './state.dto';
import { AllExceptionsFilter } from '../http-exception.filter';
class StateResponse {
  @ApiProperty()
  message: string;
  @ApiProperty()
  state: StateEntity;
}
class StateFilterDTo {
  @ApiProperty({ example: 1, required: false })
  city: number;
}

@ApiResponse({
  status: 400,
  description: 'Missing Data',
  type: BadRequestResponse,
})
@UseFilters(AllExceptionsFilter)
@Controller('state')
export class StateController {
  constructor(private stateService: StateService) {}
  @Get('/')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'filters',
    required: false,
    schema: {
      items: {
        $ref: getSchemaPath(StateFilterDTo),
      },
    },
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            message: {
              type: 'string',
            },
            states: {
              type: 'array',
              items: { $ref: getSchemaPath(StateEntity) },
            },
          },
        },
      ],
    },
  })
  @UseGuards(AuthGuard())
  async index(
    @Query() query: StateFilterDTo,
  ): Promise<{ message: string; states: StateEntity[] }> {
    const states = await this.stateService.index(query);
    return { message: 'get all states', states: states };
  }
  @Post('/')
  @ApiBearerAuth()
  @ApiOkResponse({ type: StateResponse })
  @UseGuards(AuthGuard())
  async store(
    @GetUser() user: UserEntity,
    @Body() body: StateDto,
  ): Promise<{ message: string; state: StateEntity }> {
    const state = await this.stateService.store(body);
    return { message: 'new state created', state: state };
  }
}
