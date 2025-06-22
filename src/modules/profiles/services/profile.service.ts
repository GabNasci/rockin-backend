import { Injectable, Logger } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { ProfileRepository } from '@modules/profiles/repositories/profile.repository';
import { CreateProfileBodyDTO } from '../dtos/create_profile_body.dto';
import { ProfileTypeRepository } from '../repositories/profile_type.repository';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { AppException } from '@/errors/appException';
import { SpecialityRepository } from '../repositories/speciality.repository';
import { GenreRepository } from '../repositories/genre.repository';
import * as bcrypt from 'bcryptjs';
import { BandRepository } from '../repositories/band.repository';
import { SearchResponseBodyDTO } from '../dtos/search_response_body.dto';
import formatCoordinates from '@/utils/formatCoordinates';
import { RequestUserPayloadDTO } from '../dtos/request_user_payload.dto';
import { AuthService } from '@modules/auth/services/auth.service';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { UpdateProfileBodyDTO } from '../dtos/update_profile_body.dto';
import { UpdateLocationBodyDTO } from '../dtos/update_location_body.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly profileTypeRepository: ProfileTypeRepository,
    private readonly userRepository: UserRepository,
    private readonly specialityRepository: SpecialityRepository,
    private readonly genreRepository: GenreRepository,
    private readonly bandRepository: BandRepository,
    private readonly authService: AuthService,
  ) {}

  async create(profile: CreateProfileBodyDTO): Promise<Profile> {
    Logger.log('Creating profile', 'ProfileService');

    await this.findAndVerifyUserEmailExists(profile.email);

    await this.findAndVerifyProfileHandleExists(profile.handle);

    await this.verifyIfProfileTypeExists(profile.profileTypeId);

    if (profile.specialities)
      await this.verifyIfSpecialitiesExists(profile.specialities);

    if (profile.genres) await this.verifyIfGenresExists(profile.genres);

    Logger.log('Hashing password', 'ProfileService');
    const hashedPassword = await bcrypt.hash(profile.password, 10);

    Logger.log('Creating user', 'ProfileService');
    const user = await this.userRepository.create({
      email: profile.email,
      password: hashedPassword,
    });

    if (!user) {
      Logger.error('User not created', 'ProfileService');
      throw new AppException({
        message: 'user not created',
        statusCode: 400,
      });
    }
    try {
      Logger.log('Creating profile', 'ProfileService');
      const newProfile = await this.profileRepository.create(profile, user.id);

      Logger.log(`Profile created with id: ${newProfile.id}`, 'ProfileService');
      return newProfile;
    } catch (error) {
      Logger.error('Error creating profile', 'ProfileService', error);
      throw new AppException({
        message: 'profile creation failed',
        statusCode: 500,
      });
    }
  }

  async update(profileId: number, profile: UpdateProfileBodyDTO) {
    Logger.log('Updating profile', 'ProfileService');
    const profileToUpdate = await this.profileRepository.findById(profileId);
    if (!profileToUpdate) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        message: 'profile not found',
        statusCode: 404,
      });
    }
    const handleFinded = await this.profileRepository.findByHandle(
      profile.handle,
    );

    if (handleFinded && handleFinded.id !== profileToUpdate.id) {
      Logger.error('Handle already exists', 'ProfileService');
      throw new AppException({
        message: 'Nome de usuário já existe',
        statusCode: 400,
      });
    }
    if (profile.specialities?.length > 0) {
      const specialities = await this.specialityRepository.findManyByIds(
        profile.specialities,
      );
      if (specialities.length !== profile.specialities.length) {
        Logger.error('Specialty not found', 'ProfileService');
        throw new AppException({
          message: 'Especialidade não encontrada',
          statusCode: 404,
        });
      }
      const invalidSpecialities = specialities.filter(
        (speciality) =>
          speciality.profile_type_id !== profileToUpdate.profile_type_id,
      );

      if (invalidSpecialities.length > 0) {
        Logger.error('Invalid specialities for profile type', 'ProfileService');
        throw new AppException({
          message: 'Especialidades inválidas para o tipo de perfil',
          statusCode: 400,
        });
      }
    }

    if (profile.genres?.length > 0) {
      const genres = await this.genreRepository.findManyByIds(profile.genres);
      if (genres.length !== profile.genres.length) {
        Logger.error('Genre not found', 'ProfileService');
        throw new AppException({
          message: 'Gênero não encontrado',
          statusCode: 404,
        });
      }
    }

    return await this.profileRepository.update(profileId, profile);
  }

  async createOnlyProfile(profile: {
    name: string;
    handle: string;
    userId: number;
    profileTypeId: number;
  }): Promise<Profile> {
    Logger.log('Creating profile', 'ProfileService');
    try {
      const newProfile = await this.profileRepository.simpleCreate(profile);
      Logger.log(`Profile created with id: ${newProfile.id}`, 'ProfileService');
      return newProfile;
    } catch (error) {
      Logger.error('Error creating profile', 'ProfileService', error);
      throw new AppException({
        message: 'profile creation failed',
        statusCode: 500,
      });
    }
  }

  async changeProfile(
    payload: RequestUserPayloadDTO,
    newProfileId: number,
  ): Promise<{ token: string; profile: Profile }> {
    // Verifica se o novo profile pertence ao usuário
    const profile = await this.profileRepository.findById(newProfileId);
    if (!profile) {
      throw new AppException({
        statusCode: 404,
        error: 'Not found',
        message: 'profile not found',
      });
    }

    await this.verifyIfUserIsOwner(newProfileId, payload.user.id);

    // Calcula tempo restante do token atual
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const tokenExp = payload.user.exp;
    const expiresIn = tokenExp ? tokenExp - currentTimestamp : undefined;

    if (expiresIn !== undefined && expiresIn <= 0) {
      throw new AppException({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Token expirado',
      });
    }

    // Gera novo token com mesmo tempo restante (ou com padrão do serviço se expiresIn for undefined)
    const token = await this.authService.generateToken(
      {
        id: payload.user.id,
        profileId: newProfileId,
      },
      expiresIn,
    );

    return { token, profile };
  }

  async findByUserIdAndProfileId(
    userId: number,
    profileId: number,
  ): Promise<Profile> {
    Logger.log('Finding profile by user id and profile id', 'ProfileService');
    const profile = await this.profileRepository.findByUserIdAndProfileId(
      userId,
      profileId,
    );
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    await this.verifyIfUserIsOwner(profileId, userId);
    return profile;
  }

  async findProfilesByUserId(userId: number): Promise<Profile[]> {
    Logger.log('Finding profiles by user id', 'ProfileService');
    const profiles = await this.profileRepository.findManyByUserId(userId);
    if (!profiles) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        message: 'profile not found',
        statusCode: 404,
      });
    }
    return profiles;
  }

  async verifyIfProfilesExists(profiles: number[]) {
    Logger.log('Verifying if profiles exists', 'ProfileService');
    const profilesExists = await this.profileRepository.findManyByIds(profiles);
    if (profilesExists.length !== profiles.length) {
      Logger.error('One or more profiles do not exist', 'ProfileService');
      throw new AppException({
        message: 'one or more profiles do not exist',
        statusCode: 400,
      });
    }
  }

  async findAndVerifyUserEmailExists(email: string) {
    Logger.log('Finding user by email', 'ProfileService');
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      Logger.error('User already exists', 'ProfileService');
      throw new AppException({
        message: 'user already exists',
        statusCode: 400,
      });
    }
  }

  async findAndVerifyProfileHandleExists(handle: string) {
    Logger.log('Finding profile by handle', 'ProfileService');
    const user = await this.profileRepository.findByHandle(handle);
    if (user) {
      Logger.error('Profile with this handle already exists', 'ProfileService');
      throw new AppException({
        message: 'Nome de usuário já está em uso',
        statusCode: 400,
      });
    }
  }

  async verifyIfProfileTypeExists(profileTypeId: number) {
    Logger.log('Verifying if profile type exists', 'ProfileService');
    const profileType =
      await this.profileTypeRepository.findById(profileTypeId);
    if (!profileType) {
      Logger.error('Profile type not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile type not found',
        statusCode: 404,
      });
    }
  }

  async verifyIfGenresExists(genreIds: number[]) {
    Logger.log('Verifying if genres exists', 'ProfileService');
    const genres = await this.genreRepository.findMany(genreIds);
    if (genres.length !== genreIds.length) {
      Logger.error('Genre not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'genre not found',
        statusCode: 404,
      });
    }
  }

  async verifyIfSpecialitiesExists(specialityIds: number[]) {
    Logger.log('Verifying if specialities exists', 'ProfileService');
    const specialities =
      await this.specialityRepository.findMany(specialityIds);
    if (specialities.length !== specialityIds.length) {
      Logger.error('Speciality not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'speciality not found',
        statusCode: 404,
      });
    }
  }

  async verifyIfProfileExists(profileId: number) {
    Logger.log('Verifying if profile exists', 'ProfileService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    return profile;
  }

  async verifyIfUserIsOwner(profileId: number, userId: number) {
    Logger.log('Verifying if user is owner', 'ProfileService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    if (profile.user_id !== userId) {
      Logger.error('User is not owner', 'ProfileService');
      throw new AppException({
        error: 'Forbidden',
        message: 'user is not owner',
        statusCode: 403,
      });
    }
  }

  async addSpecialities({
    userId,
    profileId,
    specialityIds,
  }: {
    userId: number;
    profileId: number;
    specialityIds: number[];
  }): Promise<Profile> {
    Logger.log('Adding speciality to profile', 'ProfileService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        message: 'profile not found',
        statusCode: 400,
      });
    }

    await this.verifyIfUserIsOwner(profile.id, userId);

    const specialitiesFounded =
      await this.specialityRepository.findMany(specialityIds);

    if (specialitiesFounded.length !== specialityIds.length) {
      Logger.error('Speciality not found', 'ProfileService');
      throw new AppException({
        message: 'speciality not found',
        statusCode: 400,
      });
    }

    Logger.log('Removing specialities from profile', 'ProfileService');
    await this.profileRepository.removeSpecialities(profileId);

    Logger.log('Assigning specialities to profile', 'ProfileService');
    return await this.profileRepository.addSpecialities(
      profile.id,
      specialitiesFounded.map((speciality) => speciality.id),
    );
  }

  async addGenres({
    userId,
    profileId,
    genreIds,
  }: {
    userId: number;
    profileId: number;
    genreIds: number[];
  }): Promise<Profile> {
    Logger.log('Adding genre to profile', 'ProfileService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }

    await this.verifyIfUserIsOwner(profile.id, userId);

    const genresFounded = await this.genreRepository.findMany(genreIds);
    if (genresFounded.length !== genreIds.length) {
      Logger.error('Genre not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'genre not found',
        statusCode: 404,
      });
    }

    Logger.log('Removing genres from profile', 'ProfileService');
    await this.profileRepository.removeGenres(profileId);

    Logger.log('Assigning genres to profile', 'ProfileService');
    return await this.profileRepository.addGenres(profileId, genreIds);
  }

  async findAll(): Promise<Profile[]> {
    Logger.log('Finding all profiles', 'ProfileService');
    return await this.profileRepository.findAll();
  }

  async findAllWithMeta(profileId?: number): Promise<Profile[]> {
    Logger.log('Finding all profiles', 'ProfileService');
    return await this.profileRepository.findAllWithMeta(profileId);
  }

  async search({
    page,
    limit,
    profileId,
    radius,
    profileTypes,
    search,
    specialities,
    genres,
  }: {
    page: number;
    limit: number;
    profileId?: number;
    radius?: number;
    search?: string;
    profileTypes?: string[];
    specialities?: string[];
    genres?: string[];
  }): Promise<SearchResponseBodyDTO> {
    Logger.log('Searching profiles', 'ProfileService');
    const userProfile = await this.profileRepository.findById(profileId);

    const latitudeRaw = userProfile?.locations?.latitude;
    const longitudeRaw = userProfile?.locations?.longitude;

    const latitude = formatCoordinates(latitudeRaw);
    const longitude = formatCoordinates(longitudeRaw);

    Logger.log(`user ${userProfile?.avatar} searching`, 'ProfileService');
    Logger.log(`search ${search}`, 'ProfileService');
    const skip = (page - 1) * limit;
    const { profiles, total } = await this.profileRepository.search({
      search: search,
      skip: skip,
      take: limit,
      radius: radius,
      latitude: latitude,
      longitude: longitude,
      profileTypes: profileTypes,
      specialities: specialities,
      genres: genres,
      profileId: profileId,
    });

    const isFirstPage = page === 1;
    const isLastPage = page === Math.ceil(total / limit);
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;

    return {
      profiles: profiles,
      page: page,
      limit: limit,
      total: total,
      totalPages: totalPages,
      isFirstPage,
      isLastPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: !isFirstPage ? page - 1 : null,
    };
  }

  async findById(id: number): Promise<Profile | null> {
    Logger.log('Finding profile by id', 'ProfileService');
    return await this.profileRepository.findById(id);
  }

  async findProfileByHandle(handle: string, profileId?: number) {
    Logger.log('Finding profile by handle', 'ProfileService');
    const profile = await this.profileRepository.findByHandle(handle);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    return await this.profileRepository.findByHandleWithMeta(handle, profileId);
  }

  async findByHandle(
    handle: string,
    profileId: number,
    userId: number,
  ): Promise<Profile | null> {
    Logger.log('Finding profile by handle', 'ProfileService');
    const profile = await this.profileRepository.findByHandle(handle);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    await this.verifyIfUserIsOwner(profile.id, userId);
    return await this.profileRepository.findByHandle(handle);
  }

  async addAvatarToProfile(file: { filename: string }, profileId: number) {
    if (!file) {
      throw new AppException({
        error: 'Not found',
        message: 'file not found',
        statusCode: 404,
      });
    }
    Logger.log('Adding avatar to profile', 'ProfileService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }

    if (profile.avatar) {
      const filePath = join(process.cwd(), 'uploads', profile.avatar);

      try {
        await unlink(filePath);
      } catch (err) {
        Logger.warn(
          `Erro ao remover arquivo de avatar: ${err instanceof Error ? err.message : String(err)}`,
        );
        throw new AppException({
          error: 'Internal Server Error',
          message: 'Erro ao remover arquivo de avatar',
          statusCode: 500,
        });
      }
    }

    const avatar = await this.profileRepository.addAvatar(
      profileId,
      file.filename,
    );
    return avatar;
  }

  async removeAvatarFile(avatar: string) {
    Logger.log('Removing avatar from profile', 'ProfileService');
    const filePath = join(process.cwd(), 'uploads', avatar);
    try {
      await unlink(filePath);
    } catch (err) {
      Logger.warn(
        `Erro ao remover arquivo de avatar: ${err instanceof Error ? err.message : String(err)}`,
      );
      throw new AppException({
        error: 'Internal Server Error',
        message: 'Erro ao remover arquivo de avatar',
        statusCode: 500,
      });
    }
  }

  async removeAvatarFromProfile(profileId: number) {
    Logger.log('Removing avatar from profile', 'ProfileService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }

    if (profile.avatar) {
      await this.removeAvatarFile(profile.avatar);
    }

    await this.profileRepository.removeAvatar(profileId);
  }

  async followProfile(followerId: number, followingId: number) {
    Logger.log('Following profile', 'ProfileService');
    const followerProfile = await this.profileRepository.findById(followerId);
    if (!followerProfile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    const followingProfile = await this.profileRepository.findById(followingId);
    if (!followingProfile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    if (followerId === followingId) {
      Logger.error('You cannot follow yourself', 'ProfileService');
      throw new AppException({
        error: 'Bad Request',
        message: 'You cannot follow yourself',
        statusCode: 400,
      });
    }
    const isFollowing = await this.profileRepository.isFollowing(
      followerId,
      followingId,
    );
    if (isFollowing) {
      Logger.error('You are already following this profile', 'ProfileService');
      throw new AppException({
        error: 'Bad Request',
        message: 'You are already following this profile',
        statusCode: 400,
      });
    }
    await this.profileRepository.followProfile(followerId, followingId);
  }

  async unfollowProfile(followerId: number, followingId: number) {
    Logger.log('Unfollowing profile', 'ProfileService');
    const followerProfile = await this.profileRepository.findById(followerId);
    if (!followerProfile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    const followingProfile = await this.profileRepository.findById(followingId);
    if (!followingProfile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    if (followerId === followingId) {
      Logger.error('You cannot unfollow yourself', 'ProfileService');
      throw new AppException({
        error: 'Bad Request',
        message: 'You cannot unfollow yourself',
        statusCode: 400,
      });
    }
    const isFollowing = await this.profileRepository.isFollowing(
      followerId,
      followingId,
    );
    if (!isFollowing) {
      Logger.error('You are not following this profile', 'ProfileService');
      throw new AppException({
        error: 'Bad Request',
        message: 'You are not following this profile',
        statusCode: 400,
      });
    }
    await this.profileRepository.unfollowProfile(followerId, followingId);
  }

  async getFollowers(profileId: number) {
    Logger.log('Getting followers', 'ProfileService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    const followers = await this.profileRepository.findFollowers(profileId);
    return followers;
  }

  async getFollowing(profileId: number) {
    Logger.log('Getting following', 'ProfileService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    const following = await this.profileRepository.findFollowings(profileId);
    return following;
  }

  async isFolllowing(followerId: number, followingId: number) {
    Logger.log('Checking if following', 'ProfileService');
    const followerProfile = await this.profileRepository.findById(followerId);
    if (!followerProfile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    const followingProfile = await this.profileRepository.findById(followingId);
    if (!followingProfile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    const following = await this.profileRepository.isFollowing(
      followerId,
      followingId,
    );
    return following;
  }

  async searchFollowings(profileId: number, search: string) {
    Logger.log('Searching followings', 'ProfileService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    const followings = await this.profileRepository.searchFollowings(
      profileId,
      search,
    );
    return followings;
  }

  async checkHandleExists(handle: string) {
    Logger.log('Checking handle exists', 'ProfileService');
    await this.findAndVerifyProfileHandleExists(handle);
  }

  async checkEmailExists(email: string) {
    Logger.log('Checking email exists', 'ProfileService');
    await this.findAndVerifyUserEmailExists(email);
  }

  async deleteProfile(profileId: number, userProfileId: number) {
    Logger.log('Deleting profile', 'ProfileService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    if (profile.id !== userProfileId) {
      Logger.error(
        'You are not authorized to delete this profile',
        'ProfileService',
      );
      throw new AppException({
        error: 'Unauthorized',
        message: 'You are not authorized to delete this profile',
        statusCode: 401,
      });
    }
    if (profile.avatar) {
      await this.removeAvatarFile(profile.avatar);
    }

    await this.profileRepository.deleteProfile(profileId);
  }

  async updateLocation(profileId: number, location: UpdateLocationBodyDTO) {
    Logger.log('Updating location', 'ProfileService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    await this.profileRepository.upsertLocation(profileId, {
      ...location,
    });
  }
}
