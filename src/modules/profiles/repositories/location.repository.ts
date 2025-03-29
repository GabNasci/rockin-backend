import { Injectable } from '@nestjs/common';
import { Location, Prisma } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class LocationRepository {
  constructor(private prisma: PrismaService) {}

  async create(location: Prisma.LocationCreateInput): Promise<Location> {
    return await this.prisma.location.create({
      data: {
        ...location,
      },
    });
  }

  async findAll(): Promise<Location[]> {
    return await this.prisma.location.findMany();
  }

  async findById(id: number): Promise<Location | null> {
    return await this.prisma.location.findUnique({
      where: {
        id,
      },
    });
  }
}
