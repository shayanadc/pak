import { Controller, Get, Query, UseFilters, UseGuards } from '@nestjs/common';
import { CityService } from '../city/city.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { CityEntity } from '../address/city.entity';
import { AuthGuard } from '@nestjs/passport';
import { CareerEntity } from './career.entity';
import { CareerService } from './career.service';
import { BadRequestResponse } from '../api.response.swagger';
import { AllExceptionsFilter } from '../http-exception.filter';
import { UserEntity } from '../auth/user.entity';
class CareerResponse {
  @ApiProperty()
  careers: CareerEntity;
}
@ApiResponse({
  status: 400,
  description: 'Missing Data',
  type: BadRequestResponse,
})
@UseFilters(AllExceptionsFilter)
@Controller('career')
export class CareerController {
  constructor(private jobService: CareerService) {}
  @Get('/')
  @ApiBearerAuth()
  @ApiOkResponse({ type: CareerResponse })
  @UseGuards(AuthGuard())
  async index(): Promise<{ message: string; careers: CareerEntity[] }> {
    const jobs = await this.jobService.index();
    return { message: 'All Careers', careers: jobs };
  }
}
