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
    Logger.log('/profiles/bands/add', 'POST');
    return await this.bandService.createBandProfile({
      userId: req.user.id,
      profileId: body.profileId,
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

  @UseGuards(AuthGuard)
  @Put('/members/add')
  async addMemberToBand(@Body() body: AddMembersToBandBodyDTO) {
    Logger.log('/profiles/bands/members/add', 'POST');
    return await this.bandService.addMembersToBand(
      body.profileId,
      body.bandId,
      body.members,
    );
  }
}
