import { Controller, Get, UseGuards } from '@nestjs/common';
import { StateRepository } from '../address/state.repository';
import { AuthGuard } from '@nestjs/passport';
import { StateEntity } from '../address/state.entity';
import { StateService } from './state.service';

@Controller('state')
export class StateController {
  constructor(private stateService: StateService) {}
  @Get('/')
  @UseGuards(AuthGuard())
  async index(): Promise<{ states: StateEntity[] }> {
    const states = await this.stateService.index();
    return { states: states };
  }
}
