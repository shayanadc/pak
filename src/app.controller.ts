import { Controller, Get, Render, UseFilters } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  index() {
    return { message: 'gagda' };
  }
}
