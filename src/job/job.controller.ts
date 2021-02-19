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
import { JobEntity } from './job.entity';
import { JobService } from './job.service';

@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}
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
            jobs: {
              type: 'array',
              items: { $ref: getSchemaPath(JobEntity) },
            },
          },
        },
      ],
    },
  })
  @UseGuards(AuthGuard())
  async index(): Promise<{ message: string; jobs: JobEntity[] }> {
    const jobs = await this.jobService.index();
    return { message: 'All Jobs', jobs: jobs };
  }
}
