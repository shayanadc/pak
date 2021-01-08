import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../auth/user.entity';
import { OrderDto } from '../order/order.dto';
import { InvoiceService } from './invoice.service';
import { InvoiceEntity } from './invoice.entity';
import { AllExceptionsFilter } from '../http-exception.filter';
import { BadRequestResponse } from '../api.response.swagger';

class InvoiceFilterDTo {
  @ApiProperty()
  user: number;
  @ApiProperty()
  payback: boolean;
}
class invoiceResponse {
  @ApiProperty()
  message: string;
  @ApiProperty()
  invoice: InvoiceEntity;
}
@UseFilters(AllExceptionsFilter)
@ApiResponse({
  status: 400,
  description: 'Missing Data',
  type: BadRequestResponse,
})
@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Post('/')
  @ApiBearerAuth()
  @ApiOkResponse({ type: invoiceResponse })
  @UseGuards(AuthGuard())
  async store(
    @GetUser() user: UserEntity,
  ): Promise<{ message: string; invoice: InvoiceEntity }> {
    const invoice = await this.invoiceService.submitInvoice(user);
    return { message: 'create new invoice', invoice: invoice };
  }

  @Get('/')
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            message: { type: 'string' },
            invoices: {
              type: 'array',
              items: { $ref: getSchemaPath(InvoiceEntity) },
            },
          },
        },
      ],
    },
  })
  @UseGuards(AuthGuard())
  async index(
    @GetUser() user: UserEntity,
    @Query() query: InvoiceFilterDTo,
  ): Promise<{ message: string; invoices: InvoiceEntity[] }> {
    query.user = user.id;
    const invoices = await this.invoiceService.index(query);
    return { message: 'return all index', invoices: invoices };
  }
}
