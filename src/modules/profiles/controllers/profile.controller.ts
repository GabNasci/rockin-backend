import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ProfileService } from '@modules/profiles/services/profile.service';
import { CreateProfileBodyDTO } from '@modules/profiles/dtos/create_profile_body.dto';

@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  async createProfile(@Body() body: CreateProfileBodyDTO) {
    Logger.log('/profiles', 'POST');
    return await this.profileService.create(body);
  }

  @Post('/specialities/add')
  async addSpecialitiesToProfile(
    @Body() body: { profileId: number; specialityIds: number[] },
  ) {
    Logger.log('/profiles/specialities/add', 'POST');
    return await this.profileService.addSpecialities(body);
  }

  @Post('/genres/add')
  async addGenresToProfile(
    @Body() body: { profileId: number; genreIds: number[] },
  ) {
    Logger.log('/profiles/genres/add', 'POST');
    return await this.profileService.addGenres(body);
  }

  @Get()
  async getAllProfiles() {
    Logger.log('/profiles', 'GET');
    return await this.profileService.findAll();
  }
}
