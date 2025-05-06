import { Injectable, Logger } from '@nestjs/common';
import { Speciality } from '@prisma/client';
import { SpecialityRepository } from '../repositories/speciality.repository';
import { AppException } from '@/errors/appException';
import { ProfileTypeRepository } from '../repositories/profile_type.repository';

@Injectable()
export class SpecialityService {
  constructor(
    private readonly specialityRepository: SpecialityRepository,
    private readonly profileTypeRepository: ProfileTypeRepository,
  ) {}

  async findAll(): Promise<Speciality[]> {
    Logger.log('Finding all specialities', 'SpecialityService');
    return await this.specialityRepository.findAll();
  }

  async findManyByProfileTypeId(profileTypeId: number): Promise<Speciality[]> {
    Logger.log('Finding all specialities', 'SpecialityService');
    const profileType =
      await this.profileTypeRepository.findById(profileTypeId);
    if (!profileType) {
      Logger.error('Profile type not found', 'SpecialityService');
      throw new AppException({
        error: 'Not found',
        message: 'profile type not found',
        statusCode: 404,
      });
    }
    return await this.specialityRepository.findManyByProfileTypeId(
      profileTypeId,
    );
  }

  async vreifyIfSpecialityExists(specialityId: number): Promise<void> {
    Logger.log('Verifying if speciality exists', 'SpecialityService');
    const speciality = await this.specialityRepository.findById(specialityId);
    if (!speciality) {
      Logger.error('Speciality not found', 'SpecialityService');
      throw new AppException({
        error: 'Not found',
        message: 'speciality not found',
        statusCode: 404,
      });
    }
    return;
  }

  async verifyIfSpecialitiesExists(specialityIds: number[]): Promise<void> {
    Logger.log('Verifying if specialities exists', 'SpecialityService');
    const specialities =
      await this.specialityRepository.findMany(specialityIds);
    if (specialities.length !== specialityIds.length) {
      Logger.error('Speciality not found', 'SpecialityService');
      throw new AppException({
        error: 'Not found',
        message: 'speciality not found',
        statusCode: 404,
      });
    }
    return;
  }
}
