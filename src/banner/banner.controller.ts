import { Controller, Get, UseFilters } from '@nestjs/common';
import { AllExceptionsFilter } from '../http-exception.filter';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { BadRequestResponse } from '../api.response.swagger';
import { NotifyService } from '../notify/notify.service';
import { NotifyEntity } from '../notify/notify.entity';
import { BannerService } from './banner.service';
import { BannerEntity } from './banner.entity';

@UseFilters(AllExceptionsFilter)
@Controller('banner')
@ApiResponse({
  status: 400,
  description: 'Missing Data',
  type: BadRequestResponse,
})
export class BannerController {
  constructor(private bannerService: BannerService) {}
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
              items: { $ref: getSchemaPath(BannerEntity) },
            },
          },
        },
      ],
    },
  })
  // @UseGuards(AuthGuard())
  async index(): Promise<{ message: string; banners: BannerEntity[] }> {
    const banners = await this.bannerService.index();
    return { message: 'All Banners', banners: banners };
  }
}
