import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from '@modules/profiles/services/profile.service';
import { CreateProfileBodyDTO } from '@modules/profiles/dtos/create_profile_body.dto';
import { AuthGuard } from '@modules/auth/guards/auth.guard';
import { PayloadDTO } from '@modules/auth/dtos/payload.dto';

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
    @Request() req: { user: PayloadDTO },
  ) {
    Logger.log('/profiles/specialities/add', 'POST');
    return await this.profileService.addSpecialities({
      userId: req.user.id,
      profileId: body.profileId,
      specialityIds: body.specialityIds,
    });
  }

  @UseGuards(AuthGuard)
  @Put('/genres/add')
  async addGenresToProfile(
    @Body() body: { profileId: number; genreIds: number[] },
    @Request() req: { user: PayloadDTO },
  ) {
    Logger.log('/profiles/genres/add', 'POST');
    return await this.profileService.addGenres({
      userId: req.user.id,
      profileId: body.profileId,
      genreIds: body.genreIds,
    });
  }

  @Get()
  async getAllProfiles() {
    Logger.log('/profiles', 'GET');
    return await this.profileService.findAll();
  }
}
