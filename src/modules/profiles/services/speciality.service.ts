import { Injectable, Logger } from '@nestjs/common';
import { Speciality } from '@prisma/client';
import { SpecialityRepository } from '../repositories/speciality.repository';
import { AppException } from '@/errors/appException';

@Injectable()
export class SpecialityService {
  constructor(private readonly specialityRepo: SpecialityRepository) {}

  async findAll(): Promise<Speciality[]> {
    Logger.log('Finding all specialities', 'SpecialityService');
    return await this.specialityRepo.findAll();
  }

  async vreifyIfSpecialityExists(specialityId: number): Promise<void> {
    Logger.log('Verifying if speciality exists', 'SpecialityService');
    const speciality = await this.specialityRepo.findById(specialityId);
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
    const specialities = await this.specialityRepo.findMany(specialityIds);
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
