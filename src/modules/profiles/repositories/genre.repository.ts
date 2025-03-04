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
<<<<<<< HEAD

  async findMany(ids: number[]): Promise<Genre[]> {
    return await this.prisma.genre.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
=======
>>>>>>> 82b537ca63650e80ddf42e3b546af848bc6cc802
}
