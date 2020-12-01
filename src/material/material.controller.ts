import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseFilters,
  UseGuards,
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
} from '@nestjs/swagger';
import { BadRequestResponse } from '../api.response.swagger';
class materialResponse {
  @ApiProperty()
  material: MaterialEntity;
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
  @ApiOkResponse({ type: materialResponse })
  @UseGuards(AuthGuard())
  async index(): Promise<{ materials: MaterialEntity[] }> {
    const material = await this.materialServ.index();
    return { materials: material };
  }
  @Put(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: materialResponse })
  @UseGuards(AuthGuard())
  async update(
    @Body() materialDto: MaterialDto,
    @Param('id', ParseIntPipe) param,
  ): Promise<{ material: MaterialEntity }> {
    const up = await this.materialServ.update(param, materialDto);
    return { material: up };
  }
}
