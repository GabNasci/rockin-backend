import { Injectable } from '@nestjs/common';
import { Prisma, Profile } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { CreateProfileBodyDTO } from '../dtos/create_profile_body.dto';

@Injectable()
export class ProfileRepository {
  constructor(private prisma: PrismaService) {}

  async create(profile: CreateProfileBodyDTO, userId: number) {
    return this.prisma.profile.create({
      data: {
        name: profile.name,
        handle: profile.handle,
        user: {
          connect: { id: userId },
        },
        profile_type: {
          connect: { id: profile.profileTypeId },
        },
        specialities: {
          connect: profile?.specialities?.map((id) => ({ id })),
        },
        genres: {
          connect: profile?.genres?.map((id) => ({ id })),
        },
        locations: {
          create: {
            latitude: profile.location.latitude,
            longitude: profile.location.longitude,
            city: profile.location?.city,
            state: profile.location?.state,
            country: profile.location?.country,
          },
        },
      },
      include: {
        specialities: true,
        genres: true,
        locations: true,
      },
    });
  }

  async findAll(): Promise<Profile[]> {
    return await this.prisma.profile.findMany({
      include: {
        specialities: true,
        genres: true,
        locations: true,
      },
    });
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

  async findByUserIdAndProfileId(
    userId: number,
    profileId: number,
  ): Promise<Profile | null> {
    return await this.prisma.profile.findFirst({
      where: {
        user_id: userId,
        id: profileId,
      },
    });
  }

  async findProfileByUserId(userId: number): Promise<Profile | null> {
    return await this.prisma.profile.findFirst({
      where: {
        user_id: userId,
      },
    });
  }
}
