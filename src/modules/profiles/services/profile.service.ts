import { Injectable, Logger } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { ProfileRepository } from '@modules/profiles/repositories/profile.repository';
import { CreateProfileBodyDTO } from '../dtos/create_profile_body.dto';
import { ProfileTypeRepository } from '../repositories/profile_type.repository';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { AppException } from '@/errors/appException';
import { SpecialityRepository } from '../repositories/speciality.repository';
import { GenreRepository } from '../repositories/genre.repository';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly profileTypeRepository: ProfileTypeRepository,
    private readonly userRepository: UserRepository,
    private readonly specialityRepository: SpecialityRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async create(profile: CreateProfileBodyDTO): Promise<Profile> {
    Logger.log('Creating profile', 'ProfileService');

    Logger.log('Verifying user email', 'ProfileService');
    const existingUser = await this.userRepository.findByEmail(profile.email);

    if (existingUser) {
      Logger.error(
        `User with email ${profile.email} already exists`,
        'ProfileService',
      );
      throw new AppException({
        message: 'user already exists',
        statusCode: 400,
      });
    }

    const existingHandle = await this.profileRepository.findByHandle(
      profile.handle,
    );

    if (existingHandle) {
      Logger.error('Handle already exists', 'ProfileService');
      throw new AppException({
        message: 'handle already exists',
        statusCode: 400,
      });
    }

    Logger.log('Finding profile type', 'ProfileService');
    const profileType = await this.profileTypeRepository.findById(
      profile.profileTypeId,
    );

    if (!profileType) {
      Logger.error('Profile type not found', 'ProfileService');
      throw new AppException({
        message: 'profile type not found',
        statusCode: 400,
      });
    }

    const user = await this.userRepository.create({
      email: profile.email,
      password: profile.password,
    });

    if (!user) {
      Logger.error('User not created', 'ProfileService');
      throw new AppException({
        message: 'user not created',
        statusCode: 400,
      });
    }

    try {
      const newProfile = await this.profileRepository.create({
        name: profile.name,
        handle: profile.handle,
        user: {
          connect: {
            id: user.id,
          },
        },
        profile_type: {
          connect: {
            id: profile.profileTypeId,
          },
        },
      });

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

  async addSpecialities({
    profileId,
    specialityIds,
  }: {
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
    profileId,
    genreIds,
  }: {
    profileId: number;
    genreIds: number[];
  }): Promise<Profile> {
    Logger.log('Adding genre to profile', 'ProfileService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        message: 'profile not found',
        statusCode: 400,
      });
    }
    const genresFounded = await this.genreRepository.findMany(genreIds);
    if (genresFounded.length !== genreIds.length) {
      Logger.error('Genre not found', 'ProfileService');
      throw new AppException({
        message: 'genre not found',
        statusCode: 400,
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

  async findById(id: number): Promise<Profile | null> {
    Logger.log('Finding profile by id', 'ProfileService');
    return await this.profileRepository.findById(id);
  }

  async findByHandle(handle: string): Promise<Profile | null> {
    Logger.log('Finding profile by handle', 'ProfileService');
    return await this.profileRepository.findByHandle(handle);
  }
}
