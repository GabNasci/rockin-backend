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
import { AddSpecialitiesBodyDTO } from '../dtos/add_specialities_body.dto';
import { RequestUserPayloadDTO } from '../dtos/request_user_payload.dto';
import { AddGenresBodyDTO } from '../dtos/add_genres_body.dto';
import { SearchRequestBodyDTO } from '../dtos/search_request_body.dto';

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
    @Body() body: AddSpecialitiesBodyDTO,
    @Request() req: RequestUserPayloadDTO,
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
    @Body() body: AddGenresBodyDTO,
    @Request() req: RequestUserPayloadDTO,
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

  @UseGuards(AuthGuard)
  @Post('/search')
  async searchProfiles(
    @Body() body: SearchRequestBodyDTO,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log('/search', 'POST');
    return await this.profileService.search(
      body.page,
      body.limit,
      req.user.id,
      body.radius,
      body.search,
    );
  }
}
