import { Injectable, Logger } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { ProfileRepository } from '@modules/profiles/repositories/profile.repository';
import { CreateProfileBodyDTO } from '../dtos/create_profile_body.dto';
import { ProfileTypeRepository } from '../repositories/profile_type.repository';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { AppException } from '@/errors/appException';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly profileTypeRepository: ProfileTypeRepository,
    private readonly userRepository: UserRepository,
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
