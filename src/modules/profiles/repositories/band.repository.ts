import { Injectable } from '@nestjs/common';
import { Band } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class BandRepository {
  constructor(private prisma: PrismaService) {}

  async create(band: {
    ownerId: number;
    profileId: number;
    memberIds: number[];
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
        members: {
          connect: band.memberIds.map((memberId) => ({
            id: memberId,
          })),
        },
      },
      include: {
        owner: true,
        profile: true,
        members: true,
      },
    });
  }

  async findAll(): Promise<Band[]> {
    return await this.prisma.band.findMany();
  }
}
