import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from '@modules/profiles/services/profile.service';
import { CreateProfileBodyDTO } from '@modules/profiles/dtos/create_profile_body.dto';
import { AuthGuard } from '@modules/auth/guards/auth.guard';
import { AddSpecialitiesBodyDTO } from '../dtos/add_specialities_body.dto';
import { RequestUserPayloadDTO } from '../dtos/request_user_payload.dto';
import { AddGenresBodyDTO } from '../dtos/add_genres_body.dto';
import { SearchRequestBodyDTO } from '../dtos/search_request_body.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppException } from '@/errors/appException';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { ProfileTypeRepository } from '../repositories/profile_type.repository';

@Controller('profiles')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private profileTypeRepository: ProfileTypeRepository,
  ) {}

  @Post()
  async createProfile(@Body() body: CreateProfileBodyDTO) {
    Logger.log('/profiles', 'POST');
    return await this.profileService.create(body);
  }

  @Get('/handle/:handle')
  async getProfileByHandle(@Param('handle') handle: string) {
    Logger.log('/profiles/handle', 'GET');
    return await this.profileService.findProfileByHandle(handle);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  async getMyProfile(@Request() req: RequestUserPayloadDTO) {
    Logger.log('/profiles/me', 'GET');
    return await this.profileService.findByUserIdAndProfileId(
      req.user.id,
      req.user.profileId,
    );
  }

  @UseGuards(AuthGuard)
  @Patch('/change-profile/:newProfileId')
  async changeProfile(
    @Param('newProfileId') newProfileId: number,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log('/profiles/change-profile', 'PATCH');
    return await this.profileService.changeProfile(req, newProfileId);
  }

  @UseGuards(AuthGuard)
  @Get('/user')
  async getProfilesByUser(@Request() req: RequestUserPayloadDTO) {
    Logger.log('/profiles/user', 'GET');
    Logger.log(req.user.exp);
    return await this.profileService.findProfilesByUserId(req.user.id);
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
    return await this.profileService.search({
      userId: req.user.id,
      page: body.page,
      limit: body.limit,
      radius: body.radius,
      search: body.search,
      specialities: body.specialities,
      genres: body.genres,
    });
  }

  @UseGuards(AuthGuard)
  @Put('/avatar/add')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          cb(null, true);
        } else {
          cb(
            new AppException({
              error: 'Bad Request',
              message: 'Only image files are allowed',
              statusCode: 400,
            }),
            false,
          );
        }
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (
          req: Express.Request,
          file: { originalname: string; fieldname: string },
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async addAvatarToProfile(
    @UploadedFile() file: { filename: string },
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log('/profiles/avatar/add', 'POST');
    await this.profileService.addAvatarToProfile(file, req.user.profileId);
  }

  @UseGuards(AuthGuard)
  @Delete('/avatar/remove')
  @HttpCode(200)
  async removeAvatarFromProfile(
    @Request() req: RequestUserPayloadDTO,
  ): Promise<void> {
    Logger.log('/profiles/avatar/remove', 'DELETE');

    await this.profileService.removeAvatarFromProfile(req.user.profileId);
  }

  @Get('/profile-types')
  async getProfileTypes() {
    Logger.log('/profiles/profile-types', 'GET');
    return await this.profileTypeRepository.findAll();
  }
}
