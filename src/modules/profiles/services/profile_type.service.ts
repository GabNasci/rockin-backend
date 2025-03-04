import { Injectable, Logger } from '@nestjs/common';
import { ProfileType } from '@prisma/client';
import { ProfileTypeRepository } from '@modules/profiles/repositories/profile_type.repository';

@Injectable()
export class ProfileTypeService {
  constructor(private readonly profileTypeRepository: ProfileTypeRepository) {}

  async findAll(): Promise<ProfileType[]> {
    Logger.log('Finding all profile types', 'ProfileTypeService');
    return await this.profileTypeRepository.findAll();
  }
}
