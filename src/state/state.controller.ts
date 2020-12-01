import { Controller, Get, UseGuards } from '@nestjs/common';
import { StateRepository } from '../address/state.repository';
import { AuthGuard } from '@nestjs/passport';
import { StateEntity } from '../address/state.entity';
import { StateService } from './state.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { BadRequestResponse } from '../api.response.swagger';
class stateResponse {
  @ApiProperty()
  states: StateEntity;
}

@ApiResponse({
  status: 400,
  description: 'Missing Data',
  type: BadRequestResponse,
})
@Controller('state')
export class StateController {
  constructor(private stateService: StateService) {}
  @Get('/')
  @ApiBearerAuth()
  @ApiResponse({
    status: 400,
    description: 'Missing Data',
    type: BadRequestResponse,
  })
  @ApiOkResponse({ type: stateResponse })
  @UseGuards(AuthGuard())
  async index(): Promise<{ states: StateEntity[] }> {
    const states = await this.stateService.index();
    return { states: states };
  }
}
