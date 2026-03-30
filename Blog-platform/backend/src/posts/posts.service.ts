import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { Post } from 'src/entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepo: Repository<Post>,
  ) {}

  async findAll(page = 1, limit = 8, search = '') {
    const query = this.postsRepo.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoin('post.comments', 'comment')
      .addSelect('COUNT(comment.id)', 'commentCount')
      .groupBy('post.id')
      .addGroupBy('author.id')
      .orderBy('post.createdAt', 'DESC');

    if (search) {
      query.where('post.title LIKE :search OR author.username LIKE :search', {
        search: `%${search}%`,
      });
    }

    const total = await query.getCount();
    const posts = await query.skip((page - 1) * limit).take(limit).getMany();

    return {
      data: posts,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const post = await this.postsRepo.findOne({
      where: { id },
      relations: ['author', 'comments', 'comments.author'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(dto: CreatePostDto, userId: number) {
    const post = this.postsRepo.create({ ...dto, author: { id: userId } });
    return this.postsRepo.save(post);
  }

  async update(id: number, dto: UpdatePostDto, userId: number, role: string) {
    const post = await this.findOne(id);
    if (post.author.id !== userId && role !== 'admin') {
      throw new ForbiddenException('Not your post');
    }
    Object.assign(post, dto);
    return this.postsRepo.save(post);
  }

  async remove(id: number, userId: number, role: string) {
    const post = await this.findOne(id);
    if (post.author.id !== userId && role !== 'admin') {
      throw new ForbiddenException('Not your post');
    }
    await this.postsRepo.remove(post);
    return { message: 'Post deleted' };
  }
}