import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BandService } from '../services/band.service';
import { AuthGuard } from '@modules/auth/guards/auth.guard';
import { AddBandBodyDTO } from '../dtos/create_band_body.dto';
import { RequestUserPayloadDTO } from '../dtos/request_user_payload.dto';
import { AppException } from '@/errors/appException';
import { AddMembersToBandBodyDTO } from '../dtos/add_members_to_band_body.dto';

@Controller('bands')
export class BandController {
  constructor(private bandService: BandService) {}

  @UseGuards(AuthGuard)
  @Post('/add')
  async addBandToProfile(
    @Body() body: AddBandBodyDTO,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log('/bands/add', 'POST');
    return await this.bandService.createBandProfile({
      userId: req.user.id,
      profileId: req.user.profileId,
      name: body.name,
      handle: body.handle,
      genres: body.genres,
    });
  }

  @Get('/:profileId')
  async getBands(@Param('profileId') profileId: number) {
    Logger.log('/profiles/bands', 'GET');
    if (!profileId) {
      throw new AppException({
        error: 'Bad Request',
        message: 'Profile id is required',
        statusCode: 400,
      });
    }
    return await this.bandService.findBands(profileId);
  }

  @Get('/:profileId/members')
  async getBandMembers(@Param('profileId') profileId: number) {
    Logger.log('/profiles/bands/members', 'GET');
    if (!profileId) {
      throw new AppException({
        error: 'Bad Request',
        message: 'Profile id is required',
        statusCode: 400,
      });
    }
    return await this.bandService.findMembersByBandProfileId(profileId);
  }

  @UseGuards(AuthGuard)
  @Put('/members/add')
  async addMemberToBand(
    @Body() body: AddMembersToBandBodyDTO,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log('/profiles/bands/members/add', 'POST');
    return await this.bandService.addMembersToBand(
      req.user.profileId,
      body.members,
    );
  }

  @Get('/info/:profileId')
  async getBandInfo(@Param('profileId') profileId: number) {
    Logger.log('/profiles/bands/info', 'GET');
    if (!profileId) {
      throw new AppException({
        error: 'Bad Request',
        message: 'Profile id is required',
        statusCode: 400,
      });
    }
    return await this.bandService.findBandByProfileId(profileId);
  }
}
