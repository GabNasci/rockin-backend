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
      include: {
        profile_type: true,
        specialities: true,
        genres: true,
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

  async updateDescription(id: number, description: string): Promise<Profile> {
    return await this.prisma.profile.update({
      where: {
        id,
      },
      data: {
        about: description,
      },
    });
  }

  async addSpecialities(
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

  async addGenres(profileId: number, genreIds: number[]): Promise<Profile> {
    return await this.prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        genres: {
          connect: genreIds.map((genreId) => ({ id: genreId })),
        },
      },
      include: {
        genres: true,
      },
    });
  }

  async removeGenres(profileId: number): Promise<Profile> {
    return this.prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        genres: {
          set: [],
        },
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
