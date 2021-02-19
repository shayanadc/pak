import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CityService } from '../city/city.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { CityEntity } from '../address/city.entity';
import { AuthGuard } from '@nestjs/passport';
import { CareerEntity } from './career.entity';
import { CareerService } from './career.service';

@Controller('job')
export class CareerController {
  constructor(private jobService: CareerService) {}
  @Get('/')
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            message: {
              type: 'string',
            },
            career: {
              type: 'array',
              items: { $ref: getSchemaPath(CareerEntity) },
            },
          },
        },
      ],
    },
  })
  @UseGuards(AuthGuard())
  async index(): Promise<{ message: string; careers: CareerEntity[] }> {
    const jobs = await this.jobService.index();
    return { message: 'All Careers', careers: jobs };
  }
}
