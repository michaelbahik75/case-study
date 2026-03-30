import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/comment.dto';
import { Comment } from 'src/entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepo: Repository<Comment>,
  ) {}

  async create(dto: CreateCommentDto, userId: number) {
    const comment = this.commentsRepo.create({
      content: dto.content,
      author: { id: userId },
      post: { id: dto.postId },
    });
    return this.commentsRepo.save(comment);
  }

  async remove(id: number, userId: number, role: string) {
    const comment = await this.commentsRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.author.id !== userId && role !== 'admin') {
      throw new ForbiddenException('Not your comment');
    }
    await this.commentsRepo.remove(comment);
    return { message: 'Comment deleted' };
  }
}