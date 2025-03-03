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
}
