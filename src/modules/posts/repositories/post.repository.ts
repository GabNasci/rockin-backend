import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostRepository {
  constructor(private prisma: PrismaService) {}

  async create(post: Prisma.PostCreateInput): Promise<Post> {
    return await this.prisma.post.create({
      data: {
        ...post,
      },
    });
  }

  async findAll(): Promise<Post[]> {
    return await this.prisma.post.findMany();
  }

  async findbyProfileId(profileId: number): Promise<Post[]> {
    return await this.prisma.post.findMany({
      where: {
        profile_id: profileId,
      },
    });
  }

  async likePost(profileId: number, postId: number) {
    await this.prisma.support.create({
      data: {
        profile: {
          connect: { id: profileId },
        },
        post: {
          connect: { id: postId },
        },
      },
    });
  }

  async unlikePost(profileId: number, postId: number) {
    await this.prisma.support.delete({
      where: {
        post_id_profile_id: {
          post_id: postId,
          profile_id: profileId,
        },
      },
    });
  }

  async deletePost(id: number): Promise<Post> {
    return await this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
