import { Injectable } from '@nestjs/common';
import { Genre } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class GenreRepository {
  constructor(private prisma: PrismaService) {}

  async create(name: string): Promise<Genre> {
    return await this.prisma.genre.create({
      data: {
        name,
      },
    });
  }

  async findAll(): Promise<Genre[]> {
    return await this.prisma.genre.findMany();
  }

  async findMany(ids: number[]): Promise<Genre[]> {
    return await this.prisma.genre.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findById(id: number): Promise<Genre | null> {
    return await this.prisma.genre.findUnique({
      where: {
        id,
      },
    });
  }
}
