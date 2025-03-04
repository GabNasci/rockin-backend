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
}
