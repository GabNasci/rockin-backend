import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { Media, Prisma } from '@prisma/client';

@Injectable()
export class MediaRepository {
  constructor(private prisma: PrismaService) {}

  async create(media: Prisma.MediaCreateInput): Promise<Media> {
    return await this.prisma.media.create({
      data: media,
    });
  }
}
