import { Injectable, Logger } from '@nestjs/common';
import { ProfileRepository } from '../repositories/profile.repository';
import { ProfileService } from './profile.service';
import { ConversationRepository } from '../repositories/conversation.repository';
import { AppException } from '@/errors/appException';
import { Conversation } from '@prisma/client';

@Injectable()
export class ConversationService {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profileRepository: ProfileRepository,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async create(profileId: number, targetId: number): Promise<Conversation> {
    const profile = await this.profileRepository.findById(profileId);
    const target = await this.profileRepository.findById(targetId);
    if (!profile || !target) {
      Logger.error('Profiles not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profiles not found',
        statusCode: 404,
      });
    }
    const conversation = await this.conversationRepository.create([
      profile.id,
      target.id,
    ]);
    return conversation;
  }

  async getProfileConversations(profileId: number): Promise<Conversation[]> {
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) {
      Logger.error('Profile not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profile not found',
        statusCode: 404,
      });
    }
    const conversations =
      await this.conversationRepository.getProfileConversations(profileId);
    return conversations;
  }

  async getConversationByProfileIds(
    profileId: number,
    targetId: number,
  ): Promise<Conversation | null> {
    const profile = await this.profileRepository.findById(profileId);
    const target = await this.profileRepository.findById(targetId);
    if (!profile || !target) {
      Logger.error('Profiles not found', 'ProfileService');
      throw new AppException({
        error: 'Not found',
        message: 'profiles not found',
        statusCode: 404,
      });
    }
    const conversation =
      await this.conversationRepository.getConversationByProfileIds(
        profileId,
        targetId,
      );
    return conversation;
  }
}
