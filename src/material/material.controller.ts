import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MaterialService } from './material.service';
import { MaterialEntity } from './material.entity';
import { AllExceptionsFilter } from '../http-exception.filter';
import { MaterialDto } from './material.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { BadRequestResponse } from '../api.response.swagger';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../auth/user.entity';
import { MaterialUpdateDto } from './material.update.dto';
class materialResponse {
  @ApiProperty()
  material: MaterialEntity;
}
class materialIdDto {
  @ApiProperty()
  id: number;
}
@UseFilters(AllExceptionsFilter)
@Controller('material')
@ApiResponse({
  status: 400,
  description: 'Missing Data',
  type: BadRequestResponse,
})
export class MaterialController {
  constructor(private materialServ: MaterialService) {}
  @Get('/')
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            materials: {
              type: 'array',
              items: { $ref: getSchemaPath(MaterialEntity) },
            },
          },
        },
      ],
    },
  })
  @UseGuards(AuthGuard())
  async index(): Promise<{ materials: MaterialEntity[] }> {
    const material = await this.materialServ.index();
    return { materials: material };
  }
  @Put(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: materialResponse })
  @UseGuards(AuthGuard())
  // @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  async update(
    @Param('id', ParseIntPipe) param: materialIdDto,
    @Body()
    materialDto: MaterialUpdateDto,
  ): Promise<{ material: MaterialEntity }> {
    const up = await this.materialServ.update(param, materialDto);
    return { material: up };
  }
  @Post('/')
  @ApiBearerAuth()
  @ApiOkResponse({ type: materialResponse })
  @UseGuards(AuthGuard())
  async store(
    @GetUser() user: UserEntity,
    @Body() body: MaterialDto,
  ): Promise<{ material: MaterialEntity }> {
    const material = await this.materialServ.store(body);
    return { material: material };
  }
}
