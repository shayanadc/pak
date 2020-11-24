import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
