import { Controller, Get, Query, UseFilters, UseGuards } from '@nestjs/common';
import { CityEntity } from '../address/city.entity';
import { CityService } from './city.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  ApiQuery,
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
@ApiResponse({
  status: 400,
  description: 'Missing Data',
  type: BadRequestResponse,
})
class CityFilterDTo {
  @ApiProperty({ example: 1, required: false })
  province: number;
}
@Controller('city')
export class CityController {
  constructor(private cityService: CityService) {}
  @Get('/')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'filters',
    required: false,
    schema: {
      items: {
        $ref: getSchemaPath(CityFilterDTo),
      },
    },
  })
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
  async index(
    @Query() query: CityFilterDTo,
  ): Promise<{ message: string; cities: CityEntity[] }> {
    const cities = await this.cityService.index(query);
    return { message: 'All Cities', cities: cities };
  }
}
