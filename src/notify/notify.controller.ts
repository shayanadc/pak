import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { AllExceptionsFilter } from '../http-exception.filter';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { BadRequestResponse } from '../api.response.swagger';
import { CityService } from '../city/city.service';
import { NotifyService } from './notify.service';
import { CityEntity } from '../address/city.entity';
import { AuthGuard } from '@nestjs/passport';
import { NotifyEntity } from './notify.entity';
@UseFilters(AllExceptionsFilter)
@Controller('notify')
@ApiResponse({
  status: 400,
  description: 'Missing Data',
  type: BadRequestResponse,
})
export class NotifyController {
  constructor(private notifyService: NotifyService) {}
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
            notifies: {
              type: 'array',
              items: { $ref: getSchemaPath(NotifyEntity) },
            },
          },
        },
      ],
    },
  })
  // @UseGuards(AuthGuard())
  async index(): Promise<{ message: string; notifies: NotifyEntity[] }> {
    const notifies = await this.notifyService.index();
    return { message: 'All Notifies', notifies: notifies };
  }
}
