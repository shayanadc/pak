import { Controller, Get, UseGuards } from '@nestjs/common';
import { CityService } from '../city/city.service';
import { ApiBearerAuth, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProvinceService } from './province.service';
import { ProvinceEntity } from '../city/province.entity';

@Controller('province')
export class ProvinceController {
  constructor(private provinceServ: ProvinceService) {}
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
            provinces: {
              type: 'array',
              items: { $ref: getSchemaPath(ProvinceEntity) },
            },
          },
        },
      ],
    },
  })
  // @UseGuards(AuthGuard())
  async index(): Promise<{ message: string; provinces: ProvinceEntity[] }> {
    const provinces = await this.provinceServ.index();
    return { message: 'All Provinces', provinces: provinces };
  }
}
