import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MaterialService } from './material.service';
import { MaterialEntity } from './material.entity';
import { AllExceptionsFilter } from '../http-exception.filter';
import { MaterialDto } from './material.dto';
import { ApiBearerAuth, ApiOkResponse, ApiProperty } from '@nestjs/swagger';
class materialResponse {
  @ApiProperty()
  material: MaterialEntity;
}
@UseFilters(AllExceptionsFilter)
@Controller('material')
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
    @Param() param,
  ): Promise<{ material: MaterialEntity }> {
    const up = await this.materialServ.update(param.id, materialDto);
    return { material: up };
  }
}
