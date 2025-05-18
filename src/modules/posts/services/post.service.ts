import { Injectable, Logger } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PostRepository } from '@modules/posts/repositories/post.repository';
import { ProfileRepository } from '@modules/profiles/repositories/profile.repository';
import { AppException } from '@/errors/appException';

@Injectable()
export class PostService {
  constructor(
    private readonly genreRepository: PostRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async create(post: Post, profileId: number): Promise<Post> {
    Logger.log('Creating a new post', 'PostService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    return await this.genreRepository.create(post, profileId);
  }
  async findAll(): Promise<Post[]> {
    Logger.log('Finding all posts', 'PostService');
    return await this.genreRepository.findAll();
  }
}
