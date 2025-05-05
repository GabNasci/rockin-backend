import { Controller, Get, Logger, Param } from '@nestjs/common';
import { SpecialityService } from '@modules/profiles/services/speciality.service';

@Controller('specialities')
export class SpecialityController {
  constructor(private specialityService: SpecialityService) {}

  @Get()
  async getAllSpecialities() {
    Logger.log('/specialities', 'GET');
    return await this.specialityService.findAll();
  }

  @Get('profile-types/:profileTypeId')
  async getSpecialitiesByProfileTypeId(
    @Param('profileTypeId') profileTypeId: number,
  ) {
    Logger.log(`/specialities/profile-types/${profileTypeId}`, 'GET');
    return await this.specialityService.findManyByProfileTypeId(profileTypeId);
  }
}
