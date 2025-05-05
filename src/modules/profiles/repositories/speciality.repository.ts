import { Injectable } from '@nestjs/common';
import { Speciality } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class SpecialityRepository {
  constructor(private prisma: PrismaService) {}

  async create(name: string, profile_type_id: number): Promise<Speciality> {
    return await this.prisma.speciality.create({
      data: {
        name,
        profile_type_id,
      },
    });
  }

  async findManyByProfileTypeId(
    profile_type_id: number,
  ): Promise<Speciality[]> {
    return await this.prisma.speciality.findMany({
      where: {
        profile_type_id,
      },
    });
  }

  async findAll(): Promise<Speciality[]> {
    return await this.prisma.speciality.findMany();
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
