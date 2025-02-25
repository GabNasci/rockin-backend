import { UserRepository } from 'src/modules/user/repositories/UserReposoitory';
import { PrismaService } from '../prisma.service';
import { User } from 'src/modules/user/entities/User';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    await this.prisma.users.create({
      data: {
        email: user.email,
        password: user.password,
      },
    });
  }
}
