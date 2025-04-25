import { Injectable } from '@nestjs/common';
import { Band, Prisma } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class BandRepository {
  constructor(private prisma: PrismaService) {}

  async create(band: {
    ownerId: number;
    profileId: number;
    genres?: number[];
    name: string;
    handle: string;
  }): Promise<Band> {
    return await this.prisma.band.create({
      data: {
        owner: {
          connect: {
            id: band.ownerId,
          },
        },
        profile: {
          connect: {
            id: band.profileId,
          },
        },
      },
    });
  }

  async findAll(): Promise<Band[]> {
    return await this.prisma.band.findMany();
  }
}
