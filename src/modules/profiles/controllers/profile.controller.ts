import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from '@modules/profiles/services/profile.service';
import { CreateProfileBodyDTO } from '@modules/profiles/dtos/create_profile_body.dto';
import { AuthGuard } from '@modules/auth/guards/auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  async createProfile(@Body() body: CreateProfileBodyDTO) {
    Logger.log('/profiles', 'POST');
    return await this.profileService.create(body);
  }

  @UseGuards(AuthGuard)
  @Put('/specialities/add')
  async addSpecialitiesToProfile(
    @Body() body: { profileId: number; specialityIds: number[] },
  ) {
    Logger.log('/profiles/specialities/add', 'POST');
    return await this.profileService.addSpecialities(body);
  }

  @UseGuards(AuthGuard)
  @Put('/genres/add')
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
