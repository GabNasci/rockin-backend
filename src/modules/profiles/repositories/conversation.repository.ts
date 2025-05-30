import { PrismaService } from '@infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Conversation } from '@prisma/client';

@Injectable()
export class ConversationRepository {
  constructor(private prisma: PrismaService) {}

  async create(profileIds: number[]): Promise<Conversation> {
    return await this.prisma.conversation.create({
      data: {
        profiles: {
          connect: profileIds.map((id) => ({ id })),
        },
      },
    });
  }

  async findById(id: number): Promise<Conversation | null> {
    return await this.prisma.conversation.findUnique({
      where: {
        id,
      },
      include: {
        profiles: true,
      },
    });
  }

  async getProfileConversations(profileId: number): Promise<Conversation[]> {
    return await this.prisma.conversation.findMany({
      where: {
        profiles: {
          some: {
            id: profileId,
          },
        },
      },
      include: {
        profiles: true,
      },
    });
  }

  async getConversationByProfileIds(
    profileId: number,
    targetId: number,
  ): Promise<Conversation | null> {
    return await this.prisma.conversation.findFirst({
      where: {
        profiles: {
          some: {
            id: {
              in: [profileId, targetId],
            },
          },
        },
      },
      include: {
        profiles: true,
      },
    });
  }
}
