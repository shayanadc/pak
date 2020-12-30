import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { CityEntity } from '../address/city.entity';
import { CityService } from './city.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { BadRequestResponse } from '../api.response.swagger';
import { AllExceptionsFilter } from '../http-exception.filter';
// class cityResponse {
//   @ApiProperty()
//   cities: CityEntity;
// }
@UseFilters(AllExceptionsFilter)
@Controller('city')
@ApiResponse({
  status: 400,
  description: 'Missing Data',
  type: BadRequestResponse,
})
export class CityController {
  constructor(private cityService: CityService) {}
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
            cities: {
              type: 'array',
              items: { $ref: getSchemaPath(CityEntity) },
            },
          },
        },
      ],
    },
  })
  @UseGuards(AuthGuard())
  async index(): Promise<{ message: string; cities: CityEntity[] }> {
    const cities = await this.cityService.index();
    return { message: 'All Cities', cities: cities };
  }
}
