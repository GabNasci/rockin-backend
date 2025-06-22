import { Injectable, Logger } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PostRepository } from '@modules/posts/repositories/post.repository';
import { ProfileRepository } from '@modules/profiles/repositories/profile.repository';
import { AppException } from '@/errors/appException';
import { MediaRepository } from '../repositories/media.repository';
import { promises as fs } from 'fs';
import * as path from 'path';

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
    taggedProfiles?: number[],
    medias?: Express.Multer.File[],
  ): Promise<Post> {
    Logger.log('Creating a new post', 'PostService');

    Logger.log('Validating profile', 'PostService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      throw new AppException({
        error: 'Not Found',
        message: 'Profile not found',
        statusCode: 404,
      });
    }

    Logger.log('Validating text or medias', 'PostService');
    if (!text && (!medias || medias.length === 0)) {
      throw new AppException({
        error: 'Bad Request',
        message: 'Text or medias is required',
        statusCode: 400,
      });
    }
    Logger.log('Validating tagged profiles', 'PostService');
    let convertedTaggedProfiles: number[] = [];
    if (taggedProfiles && taggedProfiles.length > 0) {
      convertedTaggedProfiles = taggedProfiles;
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

  async finAllByProfileId(
    profileId: number,
    userProfileId?: number,
  ): Promise<Post[]> {
    Logger.log('Finding all posts by profile id', 'PostService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      throw new AppException({
        error: 'Not Found',
        message: 'Profile not found',
        statusCode: 404,
      });
    }
    return await this.postRepository.findAllWithMetaByProfileId(
      profileId,
      userProfileId,
    );
  }

  async findAll(profileId: number | undefined) {
    Logger.log('Finding all posts', 'PostService');
    if (profileId) {
      const profile = await this.profileRepository.findById(profileId);
      if (!profile) {
        throw new AppException({
          error: 'Not Found',
          message: 'Profile not found',
          statusCode: 404,
        });
      }
      Logger.log('Finding all posts by profile id', 'PostService');
      const allPosts = await this.postRepository.findAllWhitMeta(profileId);
      return allPosts;
    }

    return await this.postRepository.findAll();
  }

  async getLinkPreview(link: string): Promise<
    | {
        title: string | null;
        description: string | null;
        image: string | null;
        url: string;
      }
    | {
        title?: undefined;
        description?: undefined;
        image?: undefined;
        url?: undefined;
      }
  > {
    Logger.log('Getting link preview', 'PostService');
    return await this.postRepository.getLinkPreview(link);
  }

  async likePost(profileId: number, postId: number) {
    Logger.log('Liking a post', 'PostService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      throw new AppException({
        error: 'Not Found',
        message: 'Profile not found',
        statusCode: 404,
      });
    }
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new AppException({
        error: 'Not Found',
        message: 'Post not found',
        statusCode: 404,
      });
    }
    await this.postRepository.likePost(profileId, postId);
  }

  async unlikePost(profileId: number, postId: number) {
    Logger.log('Unliking a post', 'PostService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      throw new AppException({
        error: 'Not Found',
        message: 'Profile not found',
        statusCode: 404,
      });
    }
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new AppException({
        error: 'Not Found',
        message: 'Post not found',
        statusCode: 404,
      });
    }
    await this.postRepository.unlikePost(profileId, postId);
  }

  async deletePost(profileId: number, postId: number) {
    Logger.log('Deleting a post', 'PostService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      throw new AppException({
        error: 'Not Found',
        message: 'Profile not found',
        statusCode: 404,
      });
    }
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new AppException({
        error: 'Not Found',
        message: 'Post not found',
        statusCode: 404,
      });
    }
    if (post.profile_id !== profile.id) {
      throw new AppException({
        error: 'Forbidden',
        message: 'You are not the owner of this post',
        statusCode: 403,
      });
    }

    const medias = await this.mediaRepository.findManyByPostId(postId);

    for (const media of medias) {
      const filePath = path.join(process.cwd(), 'uploads', media.url);
      try {
        await fs.unlink(filePath);
        Logger.log(`Arquivo ${media.url} deletado com sucesso`, 'PostService');
      } catch (error) {
        Logger.error(
          `Erro ao deletar o arquivo ${media.url}`,
          error,
          'PostService',
        );
      }
    }
    await this.postRepository.deletePost(postId);
  }
}
