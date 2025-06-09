import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConversationService } from '../services/conversation.service';
import { CreateConversationDto } from '../dtos/create_conversation.dto';
import { AuthGuard } from '@modules/auth/guards/auth.guard';
import { RequestUserPayloadDTO } from '../dtos/request_user_payload.dto';

@Controller('conversations')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createConversation(
    @Body() body: CreateConversationDto,
    @Request() req: RequestUserPayloadDTO,
  ) {
    return this.conversationService.create(req.user.profileId, body.targetId);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getProfileConversations(@Request() req: RequestUserPayloadDTO) {
    return this.conversationService.getProfileConversations(req.user.profileId);
  }

  @UseGuards(AuthGuard)
  @Get('/:targetId')
  async getConversationByProfileIds(
    @Param('targetId') targetId: number,
    @Request() req: RequestUserPayloadDTO,
  ) {
    return this.conversationService.getConversationByProfileIds(
      req.user.profileId,
      targetId,
    );
  }
}
