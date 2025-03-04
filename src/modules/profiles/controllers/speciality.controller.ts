import { Controller, Get, Logger } from '@nestjs/common';
import { SpecialityService } from '@modules/profiles/services/speciality.service';

@Controller('specialities')
export class SpecialityController {
  constructor(private specialityService: SpecialityService) {}

  @Get()
  async getAllSpecialities() {
    Logger.log('/specialities', 'GET');
    return await this.specialityService.findAll();
  }
}
