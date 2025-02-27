import { Injectable } from '@nestjs/common';
import { genres } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Injectable()
export class GenreRepository {
  constructor(private prisma: PrismaService) {}

  async create(name: string): Promise<genres> {
    return await this.prisma.genres.create({
      data: {
        name,
      },
    });
  }

  async findAll(): Promise<genres[]> {
    return await this.prisma.genres.findMany();
  }
}
