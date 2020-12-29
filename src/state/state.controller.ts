import {
  Body,
  Controller,
  Get,
  Post,
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
  state: StateEntity;
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
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
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
  async index(): Promise<{ states: StateEntity[] }> {
    const states = await this.stateService.index();
    return { states: states };
  }
  @Post('/')
  @ApiBearerAuth()
  @ApiOkResponse({ type: StateResponse })
  @UseGuards(AuthGuard())
  async store(
    @GetUser() user: UserEntity,
    @Body() body: StateDto,
  ): Promise<{ state: StateEntity }> {
    const state = await this.stateService.store(body);
    return { state: state };
  }
}
