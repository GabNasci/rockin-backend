import { Injectable } from '@nestjs/common';
import { Band, Prisma } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class BandRepository {
  constructor(private prisma: PrismaService) {}

  async create(band: Prisma.BandCreateInput): Promise<Band> {
    return await this.prisma.band.create({
      data: {
        ...band,
      },
    });
  }

  async findAll(): Promise<Band[]> {
    return await this.prisma.band.findMany();
  }
}
