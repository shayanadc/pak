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
class SumType {
  @ApiProperty()
  title: string;
  @ApiProperty()
  weight: number;
  @ApiProperty()
  materialId: number;
}
class AggType {
  @ApiProperty({ type: [SumType] })
  orders: SumType;
}

class orderResponse {
  @ApiProperty()
  message: string;
  @ApiProperty()
  order: OrderEntity;
}
class PhoneParamDto {
  @ApiProperty()
  phone: any;
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
  ): Promise<{ message: string; order: OrderEntity }> {
    const order = await this.orderService.store(user, body);
    return { message: 'create new order', order: order };
  }
  @Get('/')
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            message: { type: 'string' },
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
  async index(
    @GetUser() user: UserEntity,
  ): Promise<{ message: string; orders: OrderEntity[] }> {
    const orders = await this.orderService.index({ user: user.id });
    return { message: 'return all index', orders: orders };
  }
  @Get('/issued')
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            message: {
              type: 'string',
            },
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
  ): Promise<{ message: string; orders: OrderEntity[] }> {
    const orders = await this.orderService.index({ issuer: user.id });
    return { message: 'all order that is issued by this user', orders: orders };
  }
  @Get('/index')
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            message: {
              type: 'string',
            },
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
  ): Promise<{ message: string; orders: OrderEntity[] }> {
    const orders = await this.orderService.index();
    return { message: 'return all orders for this user', orders: orders };
  }
  @Get(':phone/aggregate')
  @ApiBearerAuth()
  @ApiOkResponse({ type: AggType })
  @UseGuards(AuthGuard())
  async aggregate(
    @GetUser() user: UserEntity,
    @Param('phone') phone: string,
  ): Promise<{ message: string; orders: AggType }> {
    const orders = await this.orderService.aggregate(phone);
    return { message: 'all of order report for this user ', orders: orders };
  }
  @Put(':phone/collect/process')
  @ApiBearerAuth()
  // @ApiOkResponse({ type: AggType })
  @UseGuards(AuthGuard())
  async processedCollectedOrders(
    @GetUser() user: UserEntity,
    @Param('phone') phone: string,
  ): Promise<{ message: string; result: string }> {
    const orders = await this.orderService.deliveredForWith(phone);
    return {
      message: 'all of order report for this user ',
      result: 'successful',
    };
  }

  @Put('settle/request')
  @ApiBearerAuth()
  // @ApiOkResponse({ type: AggType })
  @UseGuards(AuthGuard())
  async readyForSettlement(
    @GetUser() user: UserEntity,
  ): Promise<{ message: string; result: string }> {
    console.log(user);
    const orders = await this.orderService.requestForSettle(user);
    return {
      message: 'all of order report for this user ',
      result: 'successful',
    };
  }
}
