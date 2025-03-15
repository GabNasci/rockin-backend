import { Injectable, Logger } from '@nestjs/common';
import { ProfileType } from '@prisma/client';
import { ProfileTypeRepository } from '@modules/profiles/repositories/profile_type.repository';
import { AppException } from '@/errors/appException';

@Injectable()
export class ProfileTypeService {
  constructor(private readonly profileTypeRepository: ProfileTypeRepository) {}

  async findAll(): Promise<ProfileType[]> {
    Logger.log('Finding all profile types', 'ProfileTypeService');
    return await this.profileTypeRepository.findAll();
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
}
