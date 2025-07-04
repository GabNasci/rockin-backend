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
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from '@modules/profiles/services/profile.service';
import { CreateProfileBodyDTO } from '@modules/profiles/dtos/create_profile_body.dto';
import { AuthGuard } from '@modules/auth/guards/auth.guard';
import { RequestUserPayloadDTO } from '../dtos/request_user_payload.dto';
import { SearchRequestBodyDTO } from '../dtos/search_request_body.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppException } from '@/errors/appException';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { ProfileTypeRepository } from '../repositories/profile_type.repository';
import { OptionalAuthGuard } from '@modules/auth/guards/optional-auth.guard';
import { UpdateProfileBodyDTO } from '../dtos/update_profile_body.dto';
import { UpdateLocationBodyDTO } from '../dtos/update_location_body.dto';

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

  @UseGuards(AuthGuard)
  @Put()
  async updateProfile(
    @Body() body: UpdateProfileBodyDTO,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log('/profiles', 'PUT');
    return await this.profileService.update(req.user.profileId, body);
  }

  @UseGuards(OptionalAuthGuard)
  @Get('/handle/:handle')
  async getProfileByHandle(
    @Param('handle') handle: string,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log('/profiles/handle', 'GET');
    return await this.profileService.findProfileByHandle(
      handle,
      req?.user?.profileId,
    );
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

  @UseGuards(OptionalAuthGuard)
  @Get()
  async getAllProfiles(@Request() req: RequestUserPayloadDTO) {
    Logger.log('/profiles', 'GET');
    return await this.profileService.findAllWithMeta(req?.user?.profileId);
  }

  @UseGuards(AuthGuard)
  @Get('/followings')
  async searchFollowings(
    @Query('q') query: string,
    @Query('noBands') noBands: string,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log('/profiles/followings?q=' + query, 'GET');

    const shouldExcludeBands = noBands === 'true';

    return await this.profileService.searchFollowings(
      req.user.profileId,
      query || '',
      shouldExcludeBands,
    );
  }

  @UseGuards(OptionalAuthGuard)
  @Post('/search')
  async searchProfiles(
    @Body() body: SearchRequestBodyDTO,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log('/search', 'POST');
    return await this.profileService.search({
      profileId: req?.user?.profileId,
      page: body.page,
      limit: body.limit,
      radius: body.radius,
      search: body.search,
      profileTypes: body.profileTypes,
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
    Logger.log('/profiles/avatar/add', 'PUT');
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

  @UseGuards(AuthGuard)
  @Post('/:profileId/follow')
  @HttpCode(200)
  async followProfile(
    @Param('profileId') profileId: number,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log('/profiles/:profileId/follow', 'POST');
    await this.profileService.followProfile(req.user.profileId, profileId);
  }

  @UseGuards(AuthGuard)
  @Delete('/:profileId/follow')
  @HttpCode(200)
  async unfollowProfile(
    @Param('profileId') profileId: number,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log('/profiles/:profileId/follow', 'POST');
    await this.profileService.unfollowProfile(req.user.profileId, profileId);
  }

  @UseGuards(OptionalAuthGuard)
  @Get('/handle/exists/:handle')
  @HttpCode(200)
  async checkHandleExists(
    @Param('handle') handle: string,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log('/profiles/handle/exists/' + handle, 'GET');
    await this.profileService.checkHandleExists(handle, req.user?.profileId);
  }

  @Get('/email/exists/:email')
  @HttpCode(200)
  async checkEmailExists(@Param('email') email: string) {
    Logger.log('/profiles/email/exists/' + email, 'GET');
    await this.profileService.checkEmailExists(email);
  }

  @UseGuards(AuthGuard)
  @Delete('/:profileId/delete')
  @HttpCode(200)
  async deleteProfile(
    @Param('profileId') profileId: number,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log('/profiles/:profileId/delete', 'DELETE');
    await this.profileService.deleteProfile(profileId, req.user.profileId);
  }

  @UseGuards(AuthGuard)
  @Put('/location')
  async updateLocation(
    @Body() body: UpdateLocationBodyDTO,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log('/profiles/location ', 'PUT');
    return await this.profileService.updateLocation(req.user.profileId, body);
  }
}
