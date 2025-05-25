import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    post: Omit<Prisma.PostCreateInput, 'profile'>,
    profileId: number,
  ): Promise<Post> {
    return await this.prisma.post.create({
      data: {
        ...post,
        profile: {
          connect: { id: profileId },
        },
      },
    });
  }

  async createWithMedias({
    profileId,
    text,
    link,
    taggedProfiles,
    medias,
  }: {
    profileId: number;
    text?: string;
    link?: string;
    taggedProfiles?: number[];
    medias?: Express.Multer.File[];
  }): Promise<Post> {
    return this.prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          text,
          link,
          profile: { connect: { id: profileId } },
          tagged_profiles: taggedProfiles
            ? {
                connect: taggedProfiles.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          tagged_profiles: true,
        },
      });

      if (medias && medias.length > 0) {
        const mediaData = medias.map((file) => ({
          url: file.filename,
          type: file.mimetype,
          post_id: post.id,
        }));

        await tx.media.createMany({ data: mediaData });
      }

      return post;
    });
  }

  async addMedia(postId: number, mediaId: number) {
    await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        medias: {
          connect: {
            id: mediaId,
          },
        },
      },
    });
  }

  async findAll(): Promise<Post[]> {
    return await this.prisma.post.findMany();
  }

  async findManyByProfileId(profileId: number): Promise<Post[]> {
    return await this.prisma.post.findMany({
      where: {
        OR: [
          {
            profile_id: profileId,
          },
          {
            tagged_profiles: {
              some: {
                id: profileId,
              },
            },
          },
        ],
      },
      include: {
        medias: true,
        tagged_profiles: true,
        profile: {
          include: {
            specialities: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
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
