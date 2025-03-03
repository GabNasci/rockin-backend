import { Injectable, Logger } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PostRepository } from '@modules/posts/repositories/post.repository';

@Injectable()
export class PostService {
  constructor(private readonly genreRepository: PostRepository) {}

  async findAll(): Promise<Post[]> {
    Logger.log('Finding all posts', 'PostService');
    return await this.genreRepository.findAll();
  }
}
