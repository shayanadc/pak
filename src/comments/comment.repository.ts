import { EntityRepository, Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';

@EntityRepository(CommentEntity)
export class CommentRepository extends Repository<CommentEntity> {
  async index(): Promise<CommentEntity[]> {
    return await this.find();
  }
  async store(user, param): Promise<CommentEntity> {
    let message = new CommentEntity();
    message.subject = param.subject;
    message.context = param.context;
    message.user = user;
    await message.save();
    return message;
  }
}
