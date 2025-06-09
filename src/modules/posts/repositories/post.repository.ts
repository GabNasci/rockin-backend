import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';
import * as cheerio from 'cheerio';
import axios from 'axios';

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

  async findAll() {
    const posts = await this.prisma.post.findMany({
      orderBy: {
        created_at: 'desc',
      },
      include: {
        supports: {
          include: {
            profile: true,
          },
        },
        medias: true,
        tagged_profiles: true,
        profile: {
          include: {
            specialities: true,
          },
        },
      },
    });
    return posts.map((post) => ({
      ...post,
      liked: false,
      likedCount: post.supports.length,
    }));
  }

  async findAllWhitMeta(profileId: number | undefined) {
    const AllpostsWithSupports = await this.prisma.post.findMany({
      orderBy: {
        created_at: 'desc',
      },
      include: {
        supports: {
          include: {
            profile: {
              select: {
                id: true,
              },
            },
          },
        },
        medias: true,
        tagged_profiles: true,
        profile: {
          include: {
            specialities: true,
          },
        },
      },
    });

    const posts = AllpostsWithSupports.map((post) => ({
      ...post,
      liked: profileId
        ? post.supports.some((support) => support.profile.id === profileId)
        : false,
      likedCount: post.supports.length,
    }));

    return posts;
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

  async findById(id: number): Promise<Post | null> {
    return await this.prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        supports: true,
        medias: true,
        tagged_profiles: true,
        profile: {
          include: {
            specialities: true,
          },
        },
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

  async getLinkPreview(url: string) {
    try {
      const { data: html }: { data: string } = await axios.get(url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
        },
      });

      const $ = cheerio.load(html);

      const getMeta = (name: string) =>
        $(`meta[property="${name}"]`).attr('content') ||
        $(`meta[name="${name}"]`).attr('content') ||
        null;

      return {
        title: getMeta('og:title') || $('title').text() || null,
        description: getMeta('og:description'),
        image: getMeta('og:image'),
        url: getMeta('og:url') || url,
      };
    } catch {
      return {};
    }
  }
}
