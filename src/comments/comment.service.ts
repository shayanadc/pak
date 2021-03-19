import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CommentEntity } from './comment.entity';
import { CommentDto } from './comment.controller';
import { UserEntity } from '../auth/user.entity';

@Injectable()
export class CommentService {
  constructor(private commentRepo: CommentRepository) {}
  async store(user: UserEntity, body: CommentDto): Promise<CommentEntity> {
    return await this.commentRepo.store(user, body);
  }
}
