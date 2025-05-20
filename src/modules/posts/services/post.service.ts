import { Injectable, Logger } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PostRepository } from '@modules/posts/repositories/post.repository';
import { ProfileRepository } from '@modules/profiles/repositories/profile.repository';
import { AppException } from '@/errors/appException';
import { MediaRepository } from '../repositories/media.repository';
import { stringArrayToNumberArray } from '@/utils/stringArrayToNumberArray';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly mediaRepository: MediaRepository,
  ) {}

  async create(
    profileId: number,
    text?: string,
    link?: string,
    taggedProfiles?: string[],
    medias?: Express.Multer.File[],
  ): Promise<Post> {
    Logger.log('Creating a new post', 'PostService');

    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      throw new AppException({
        error: 'Not Found',
        message: 'Profile not found',
        statusCode: 404,
      });
    }

    if (!text && (!medias || medias.length === 0)) {
      throw new AppException({
        error: 'Bad Request',
        message: 'Text or medias is required',
        statusCode: 400,
      });
    }
    let convertedTaggedProfiles: number[] = [];
    if (taggedProfiles && taggedProfiles.length > 0) {
      convertedTaggedProfiles = stringArrayToNumberArray(taggedProfiles);
      const profiles = await this.profileRepository.findManyByIds(
        convertedTaggedProfiles,
      );
      if (profiles.length !== taggedProfiles.length) {
        throw new AppException({
          error: 'Bad Request',
          message: 'Some tagged profiles not found',
          statusCode: 400,
        });
      }
    }

    return this.postRepository.createWithMedias({
      profileId,
      text,
      link,
      taggedProfiles: convertedTaggedProfiles,
      medias,
    });
  }

  async findAll(): Promise<Post[]> {
    Logger.log('Finding all posts', 'PostService');
    return await this.postRepository.findAll();
  }
}
