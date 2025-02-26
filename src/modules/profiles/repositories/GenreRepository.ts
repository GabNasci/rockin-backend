import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Injectable()
export class GenreRepository {
  constructor(private prisma: PrismaService) {}

  async create(name: string) {
    return await this.prisma.genres.create({
      data: {
        name,
      },
    });
  }

  async findAll() {
    return await this.prisma.genres.findMany();
  }
}
