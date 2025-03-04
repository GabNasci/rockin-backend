import { Injectable } from '@nestjs/common';
import { Speciality } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class SpecialityRepository {
  constructor(private prisma: PrismaService) {}

  async create(name: string): Promise<Speciality> {
    return await this.prisma.speciality.create({
      data: {
        name,
      },
    });
  }

  async findAll(): Promise<Speciality[]> {
    return await this.prisma.genre.findMany();
  }

  async findById(id: number): Promise<Speciality | null> {
    return await this.prisma.speciality.findUnique({
      where: {
        id,
      },
    });
  }

  async findMany(ids: number[]): Promise<Speciality[]> {
    return await this.prisma.speciality.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
