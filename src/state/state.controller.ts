import { Controller, Get, UseGuards } from '@nestjs/common';
import { StateRepository } from '../address/state.repository';
import { AuthGuard } from '@nestjs/passport';
import { StateEntity } from '../address/state.entity';
import { StateService } from './state.service';
import { ApiBearerAuth, ApiOkResponse, ApiProperty } from '@nestjs/swagger';
class stateResponse {
  @ApiProperty()
  states: StateEntity[];
}
@Controller('state')
export class StateController {
  constructor(private stateService: StateService) {}
  @Get('/')
  @ApiBearerAuth()
  @ApiOkResponse({ type: stateResponse })
  @UseGuards(AuthGuard())
  async index(): Promise<{ states: StateEntity[] }> {
    const states = await this.stateService.index();
    return { states: states };
  }
}
