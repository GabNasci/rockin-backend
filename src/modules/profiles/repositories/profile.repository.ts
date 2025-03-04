import { Injectable } from '@nestjs/common';
import { Prisma, Profile } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class ProfileRepository {
  constructor(private prisma: PrismaService) {}

  async create(profile: Prisma.ProfileCreateInput): Promise<Profile> {
    return await this.prisma.profile.create({
      data: {
        ...profile,
      },
    });
  }

  async findAll(): Promise<Profile[]> {
    return await this.prisma.profile.findMany();
  }

  async findById(id: number): Promise<Profile | null> {
    return await this.prisma.profile.findUnique({
      where: {
        id,
      },
      include: {
        specialities: true,
      },
    });
  }

  async findByHandle(handle: string): Promise<Profile | null> {
    return await this.prisma.profile.findUnique({
      where: {
        handle,
      },
    });
  }

  async removeSpecialities(profileId: number): Promise<Profile> {
    return this.prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        specialities: {
          set: [],
        },
      },
    });
  }

  async assignSpecialities(
    profileId: number,
    specialityIds: number[],
  ): Promise<Profile> {
    return await this.prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        specialities: {
          connect: specialityIds.map((specialityId) => ({ id: specialityId })),
        },
      },
      include: {
        specialities: true,
      },
    });
  }

  async update(id: number, data: Prisma.ProfileUpdateInput): Promise<Profile> {
    return await this.prisma.profile.update({
      where: {
        id,
      },
      data,
      include: {
        specialities: true,
      },
    });
  }
}
