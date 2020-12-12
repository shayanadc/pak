import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';
import { OrderDto } from './order.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../auth/user.entity';
import { AllExceptionsFilter } from '../http-exception.filter';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { BadRequestResponse } from '../api.response.swagger';
class orderResponse {
  @ApiProperty()
  order: OrderEntity;
}
@UseFilters(AllExceptionsFilter)
@Controller('order')
@ApiResponse({
  status: 400,
  description: 'Missing Data',
  type: BadRequestResponse,
})
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Post('/')
  @ApiBearerAuth()
  @ApiOkResponse({ type: orderResponse })
  @UseGuards(AuthGuard())
  async store(
    @GetUser() user: UserEntity,
    @Body() body: OrderDto,
  ): Promise<{ order: OrderEntity }> {
    const order = await this.orderService.store(user, body);
    return { order: order };
  }
  @Get('/')
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            orders: {
              type: 'array',
              items: { $ref: getSchemaPath(OrderEntity) },
            },
          },
        },
      ],
    },
  })
  @UseGuards(AuthGuard())
  async index(@GetUser() user: UserEntity): Promise<{ orders: OrderEntity[] }> {
    const orders = await this.orderService.index({ user: user.id });
    return { orders: orders };
  }
  @Get('/issued')
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            orders: {
              type: 'array',
              items: { $ref: getSchemaPath(OrderEntity) },
            },
          },
        },
      ],
    },
  })
  @UseGuards(AuthGuard())
  async indexIssued(
    @GetUser() user: UserEntity,
  ): Promise<{ orders: OrderEntity[] }> {
    const orders = await this.orderService.index({ issuer: user.id });
    return { orders: orders };
  }
  @Get('/index')
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            orders: {
              type: 'array',
              items: { $ref: getSchemaPath(OrderEntity) },
            },
          },
        },
      ],
    },
  })
  @UseGuards(AuthGuard())
  async indexAll(
    @GetUser() user: UserEntity,
  ): Promise<{ orders: OrderEntity[] }> {
    const orders = await this.orderService.index();
    return { orders: orders };
  }
}
