import { Injectable } from '@nestjs/common';
import { ProfileType } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { ProfileTypeIdEnum } from '@/constants/enums';

@Injectable()
export class ProfileTypeRepository {
  constructor(private prisma: PrismaService) {}

  async create(name: string): Promise<ProfileType> {
    return await this.prisma.profileType.create({
      data: {
        name,
      },
    });
  }

  async findAll(): Promise<ProfileType[]> {
    return await this.prisma.profileType.findMany({
      where: {
        id: {
          not: ProfileTypeIdEnum.BAND,
        },
      },
    });
  }

  async findById(id: number): Promise<ProfileType | null> {
    return await this.prisma.profileType.findUnique({
      where: {
        id,
      },
    });
  }
}
