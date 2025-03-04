import { Injectable } from '@nestjs/common';
import { Image, Prisma } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class ImageRepository {
  constructor(private prisma: PrismaService) {}

  async create(image: Prisma.ImageCreateInput): Promise<Image> {
    return await this.prisma.image.create({
      data: {
        ...image,
      },
    });
  }

  async findAll(): Promise<Image[]> {
    return await this.prisma.image.findMany();
  }
}
