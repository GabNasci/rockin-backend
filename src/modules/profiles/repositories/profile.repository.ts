import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Profile, Recomendation } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { CreateProfileBodyDTO } from '../dtos/create_profile_body.dto';
import { searchProfiles } from '@prisma/client/sql';
import { SearchBody } from './interfaces/search_body.interface';

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

  async simpleCreate(profile: {
    name: string;
    handle: string;
    userId: number;
    profileTypeId: number;
  }) {
    return this.prisma.profile.create({
      data: {
        name: profile.name,
        handle: profile.handle,
        user: {
          connect: { id: profile.userId },
        },
        profile_type: {
          connect: { id: profile.profileTypeId },
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

  async search({
    skip,
    take,
    search,
    radius,
    latitude,
    longitude,
    specialities,
    genres,
    profileId,
  }: SearchBody) {
    let profileIds: number[] = [];

    const hasCoordinates =
      latitude && longitude && latitude !== null && longitude !== null;

    if (hasCoordinates && radius) {
      const profiles = await this.prisma.$queryRawTyped(
        searchProfiles(latitude, longitude, radius),
      );
      profileIds = profiles.map((profile: { id: number }) => profile.id);
    }

    if (profileId && profileIds.length > 0) {
      profileIds = profileIds.filter((id) => id !== profileId);
    }

    Logger.log('profiles encontrados:', profileIds);

    // Contagem total de registros sem aplicar paginação
    const total = await this.prisma.profile.count({
      where: {
        ...(profileIds.length ? { id: { in: profileIds } } : {}),
        name: {
          contains: search,
          mode: 'insensitive',
        },
        ...(specialities && specialities.length > 0
          ? {
              specialities: {
                some: {
                  id: {
                    in: specialities,
                  },
                },
              },
            }
          : {}),
        ...(genres && genres.length > 0
          ? {
              genres: {
                some: {
                  id: {
                    in: genres,
                  },
                },
              },
            }
          : {}),
      },
    });

    const shouldFilterByProfileIds = hasCoordinates && radius;

    const profiles = await this.prisma.profile.findMany({
      include: {
        specialities: true,
        genres: true,
        locations: true,
      },
      where: {
        ...(shouldFilterByProfileIds ? { id: { in: profileIds } } : {}),
        name: {
          contains: search,
          mode: 'insensitive',
        },
        ...(specialities && specialities.length > 0
          ? {
              specialities: {
                some: {
                  id: {
                    in: specialities,
                  },
                },
              },
            }
          : {}),
        ...(genres && genres.length > 0
          ? {
              genres: {
                some: {
                  id: {
                    in: genres,
                  },
                },
              },
            }
          : {}),
      },
      skip,
      take,
    });

    return {
      profiles,
      total,
    };
  }

  async count(): Promise<number> {
    return await this.prisma.profile.count();
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

  async findManyByIds(ids: number[]): Promise<Profile[]> {
    return await this.prisma.profile.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findByHandle(handle: string): Promise<Profile | null> {
    return await this.prisma.profile.findUnique({
      where: {
        handle,
      },
      include: {
        bands: {
          include: {
            profile: {
              include: {
                genres: true,
              },
            },
          },
        },
        images: true,
        specialities: true,
        genres: true,
        followers: true,
        following: true,
        posts: true,
      },
    });
  }

  async findByUserId(userId: number) {
    return await this.prisma.profile.findFirst({
      where: {
        user_id: userId,
      },
      include: {
        locations: true,
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
      include: {
        images: true,
        specialities: true,
        genres: true,
        followers: true,
        following: true,
        posts: true,
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

  async findManyByUserId(userId: number): Promise<Profile[]> {
    return await this.prisma.profile.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  async addAvatar(id: number, avatar: string): Promise<Profile> {
    return await this.prisma.profile.update({
      where: {
        id,
      },
      data: {
        avatar,
      },
    });
  }

  async removeAvatar(id: number): Promise<Profile> {
    return await this.prisma.profile.update({
      where: {
        id,
      },
      data: {
        avatar: null,
      },
    });
  }

  async followProfile(
    followerId: number, // quem vai seguir
    followingId: number, // quem será seguido
  ) {
    await this.prisma.recomendation.create({
      data: {
        followerId, // quem segue
        followingId, // quem é seguido
      },
      include: {
        following: true, // inclui os dados do perfil seguido
      },
    });
  }

  async unfollowProfile(followerId: number, followingId: number) {
    await this.prisma.recomendation.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }

  async findFollowers(profileId: number): Promise<Recomendation[]> {
    return await this.prisma.recomendation.findMany({
      where: {
        followingId: profileId,
      },
      include: {
        follower: true,
      },
    });
  }

  async findFollowings(profileId: number): Promise<Recomendation[]> {
    return await this.prisma.recomendation.findMany({
      where: {
        followerId: profileId,
      },
      include: {
        following: true,
      },
    });
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const recomendation = await this.prisma.recomendation.findFirst({
      where: {
        followerId,
        followingId,
      },
    });
    return !!recomendation;
  }

  async searchFollowings(
    profileId: number,
    search: string,
  ): Promise<Profile[]> {
    const followings = await this.prisma.recomendation.findMany({
      where: {
        followerId: profileId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = followings.map((following) => following.followingId);

    const profiles = await this.prisma.profile.findMany({
      where: {
        id: {
          in: followingIds,
        },
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            handle: {
              contains: search,
            },
          },
        ],
      },
      include: {
        genres: true,
        specialities: true,
      },
    });
    return profiles;
  }
}
