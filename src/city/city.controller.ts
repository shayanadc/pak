import { Controller, Get, UseGuards } from '@nestjs/common';
import { CityEntity } from '../address/city.entity';
import { CityService } from './city.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('city')
export class CityController {
  constructor(private cityService: CityService) {}
  @Get('/')
  @UseGuards(AuthGuard())
  async index(): Promise<{ cities: CityEntity[] }> {
    const cities = await this.cityService.index();
    return { cities: cities };
  }
}
