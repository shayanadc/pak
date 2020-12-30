import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestService } from './request.service';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../auth/user.entity';
import { RequestEntity } from './request.entity';
import { RequestDto } from './request.dto';
import { AllExceptionsFilter } from '../http-exception.filter';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { BadRequestResponse } from '../api.response.swagger';
class requestResponse {
  @ApiProperty()
  message: string;
  @ApiProperty()
  request: RequestEntity;
}
class RequestIdDTO {
  @ApiProperty()
  id: number;
}
@UseFilters(AllExceptionsFilter)
@Controller('request')
@ApiResponse({
  status: 400,
  description: 'Missing Data',
  type: BadRequestResponse,
})
@UseFilters(AllExceptionsFilter)
export class RequestController {
  constructor(private RequestService: RequestService) {}
  @Get('/')
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            message: {
              type: 'string',
            },
            requests: {
              type: 'array',
              items: { $ref: getSchemaPath(RequestEntity) },
            },
          },
        },
      ],
    },
  })
  @UseGuards(AuthGuard())
  async index(
    @GetUser() user: UserEntity,
  ): Promise<{ message: string; requests: RequestEntity[] }> {
    const req = await this.RequestService.getAll(user);
    return { message: 'all request', requests: req };
  }

  @Get('/all')
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            requests: {
              type: 'array',
              items: { $ref: getSchemaPath(RequestEntity) },
            },
          },
        },
      ],
    },
  })
  @UseGuards(AuthGuard())
  async indexAll(
    @GetUser() user: UserEntity,
  ): Promise<{ message: string; requests: RequestEntity[] }> {
    const req = await this.RequestService.getAll(user);
    return { message: 'return all index', requests: req };
  }

  @Post('/')
  @ApiBearerAuth()
  @ApiOkResponse({ type: requestResponse })
  @UseGuards(AuthGuard())
  async store(
    @GetUser() user: UserEntity,
    @Body() body: RequestDto,
  ): Promise<{ message: string; request: RequestEntity }> {
    const req = await this.RequestService.store(user, body);
    return { message: 'new request created', request: req };
  }
  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async delete(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) param: RequestIdDTO,
  ): Promise<{ message: string; result: string }> {
    await this.RequestService.delete(user, param);
    return { message: 'deleted', result: 'successful' };
  }
}
