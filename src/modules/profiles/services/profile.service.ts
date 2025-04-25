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

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly profileTypeRepository: ProfileTypeRepository,
    private readonly userRepository: UserRepository,
    private readonly specialityRepository: SpecialityRepository,
    private readonly genreRepository: GenreRepository,
    private readonly bandRepository: BandRepository,
  ) {}

  async create(profile: CreateProfileBodyDTO): Promise<Profile> {
    Logger.log('Creating profile', 'ProfileService');

    await this.findAndVerifyUserEmailExists(profile.email);

    await this.findAndVerifyUserHandleExists(profile.handle);

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

  async findAndVerifyUserHandleExists(handle: string) {
    Logger.log('Finding user by handle', 'ProfileService');
    const user = await this.profileRepository.findByHandle(handle);
    if (user) {
      Logger.error('User already exists', 'ProfileService');
      throw new AppException({
        message: 'user already exists',
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

  verifyIfUserIsOwner(profile: Profile, userId: number) {
    Logger.log('Verifying if user is owner', 'ProfileService');
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

    this.verifyIfUserIsOwner(profile, userId);

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

    this.verifyIfUserIsOwner(profile, userId);

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

  async search({
    page,
    limit,
    userId,
    radius,
    search,
    specialities,
    genres,
  }: {
    page: number;
    limit: number;
    userId: number;
    radius?: number;
    search?: string;
    specialities?: number[];
    genres?: number[];
  }): Promise<SearchResponseBodyDTO> {
    Logger.log('Searching profiles', 'ProfileService');
    const user = await this.userRepository.findById(userId);
    if (!user) {
      Logger.error('User not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'user not found',
        statusCode: 404,
      });
    }

    const userProfile = await this.profileRepository.findByUserId(user.id);

    if (!userProfile) {
      Logger.error('User profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'user profile not found',
        statusCode: 404,
      });
    }

    const latitudeRaw = userProfile.locations?.latitude;
    const longitudeRaw = userProfile.locations?.longitude;

    const latitude = formatCoordinates(latitudeRaw);
    const longitude = formatCoordinates(longitudeRaw);

    Logger.log(`user ${user?.email} searching`, 'ProfileService');
    Logger.log(`search ${search}`, 'ProfileService');
    const skip = (page - 1) * limit;
    const { profiles, total } = await this.profileRepository.search({
      search: search,
      skip: skip,
      take: limit,
      radius: radius,
      latitude: latitude,
      longitude: longitude,
      specialities: specialities,
      genres: genres,
      profileId: userProfile.id,
    });

    return {
      profiles: profiles,
      page: page,
      limit: limit,
      total: total,
      totalPages: Math.ceil(total / limit),
      isFirstPage: page === 1,
      isLastpage: page === Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<Profile | null> {
    Logger.log('Finding profile by id', 'ProfileService');
    return await this.profileRepository.findById(id);
  }

  async findByHandle(handle: string): Promise<Profile | null> {
    Logger.log('Finding profile by handle', 'ProfileService');
    return await this.profileRepository.findByHandle(handle);
  }

  async createBandProfile({
    name,
    handle,
    userId,
    profileId,
    genres,
  }: {
    name: string;
    handle: string;
    userId: number;
    profileId: number;
    genres?: number[];
  }) {
    Logger.log('Creating band profile', 'ProfileService');
    const profile = await this.verifyIfProfileExists(profileId);

    this.verifyIfUserIsOwner(profile, userId);

    if (genres) await this.verifyIfGenresExists(genres);

    const bandProfile = await this.bandRepository.create({
      name,
      handle,
      userId,
      profileId,
      genres,
    });
    return bandProfile;
  }
}
