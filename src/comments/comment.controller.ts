import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../auth/user.entity';
import { CommentEntity } from './comment.entity';
import { BadRequestResponse } from '../api.response.swagger';
import { AllExceptionsFilter } from '../http-exception.filter';
import { CommentService } from './comment.service';
export class CommentDto {
  @ApiProperty({ required: false })
  subject: string;
  @ApiProperty()
  context: string;
}

class CommentResponse {
  @ApiProperty()
  comment: CommentEntity;
}

@ApiResponse({
  status: 400,
  description: 'Missing Data',
  type: BadRequestResponse,
})
@UseFilters(AllExceptionsFilter)
@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Post('/')
  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentResponse })
  @UseGuards(AuthGuard())
  async store(
    @GetUser() user: UserEntity,
    @Body() body: CommentDto,
  ): Promise<{ message: string; comment: CommentEntity }> {
    const message = await this.commentService.store(user, body);
    return { message: 'create new comment', comment: message };
  }
}
