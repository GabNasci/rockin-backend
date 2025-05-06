import { Injectable, Logger } from '@nestjs/common';
import { ProfileRepository } from '../repositories/profile.repository';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { BandRepository } from '../repositories/band.repository';
import { AppException } from '@/errors/appException';
import { ProfileService } from './profile.service';
import { ProfileTypeIdEnum } from '@/constants/enums';
import { Band } from '@prisma/client';

@Injectable()
export class BandService {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profileRepository: ProfileRepository,
    private readonly userRepository: UserRepository,
    private readonly bandRepository: BandRepository,
  ) {}

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
    const profile = await this.profileService.verifyIfProfileExists(profileId);

    Logger.log('Verifying if user exists', 'ProfileService');
    const user = await this.userRepository.findById(userId);
    if (!user) {
      Logger.error('User not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'user not found',
        statusCode: 404,
      });
    }
    await this.profileService.verifyIfUserIsOwner(profile.id, userId);

    await this.profileService.findAndVerifyProfileHandleExists(handle);

    Logger.log('Creating band profile', 'ProfileService');
    const bandProfile = await this.profileService.createOnlyProfile({
      name: name,
      handle: handle,
      userId: userId,
      profileTypeId: ProfileTypeIdEnum.BAND,
    });

    if (!bandProfile) {
      Logger.error('Band profile not created', 'ProfileService');
      throw new AppException({
        error: 'Bad request',
        message: 'band profile created',
        statusCode: 400,
      });
    }

    if (genres) await this.profileService.verifyIfGenresExists(genres);

    const band = await this.bandRepository.create({
      ownerId: profile.id,
      profileId: bandProfile.id,
      memberIds: [profile.id],
    });
    return band;
  }

  async findBands(profileId: number): Promise<Band[]> {
    Logger.log('Finding bands', 'ProfileService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      return [];
    }
    return await this.bandRepository.findManyByProfileId(profile.id);
  }

  async addMembersToBand(
    profileId: number,
    bandId: number,
    memberIds: number[],
  ): Promise<Band> {
    Logger.log('Adding band members', 'ProfileService');
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }

    const band = await this.bandRepository.findById(bandId);
    if (!band) {
      Logger.error('Band not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'band not found',
        statusCode: 404,
      });
    }

    if (band.owner_id !== profile.id) {
      Logger.error('User is not the owner of the band', 'ProfileService');
      throw new AppException({
        error: 'Forbidden',
        message: 'user is not the owner of the band',
        statusCode: 403,
      });
    }

    await this.bandRepository.addMembers(bandId, memberIds);

    return band;
  }
}
