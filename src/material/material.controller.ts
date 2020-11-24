import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MaterialService } from './material.service';
import { MaterialEntity } from './material.entity';

@Controller('material')
export class MaterialController {
  constructor(private materialServ: MaterialService) {}
  @Get('/')
  @UseGuards(AuthGuard())
  async index(): Promise<{ materials: MaterialEntity[] }> {
    const material = await this.materialServ.index();
    return { materials: material };
  }
  @Put(':id')
  @UseGuards(AuthGuard())
  async update(@Body() body, @Param() param): Promise<{ any }> {
    const up = await this.materialServ.update(param.id, body);
    return up;
  }
}
