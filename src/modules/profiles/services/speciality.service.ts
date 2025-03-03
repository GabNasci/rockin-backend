import { Injectable, Logger } from '@nestjs/common';
import { Speciality } from '@prisma/client';
import { SpecialityRepository } from '../repositories/speciality.repository';

@Injectable()
export class SpecialityService {
  constructor(private readonly specialityRepo: SpecialityRepository) {}

  async findAll(): Promise<Speciality[]> {
    Logger.log('Finding all specialities', 'SpecialityService');
    return await this.specialityRepo.findAll();
  }
}
