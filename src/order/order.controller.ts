import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';
import { OrderDto } from './order.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../auth/user.entity';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Post('/')
  @UseGuards(AuthGuard())
  async store(
    @GetUser() user: UserEntity,
    @Body() body: OrderDto,
  ): Promise<{ order: OrderEntity }> {
    const order = await this.orderService.store(user, body);
    return { order: order };
  }
}
