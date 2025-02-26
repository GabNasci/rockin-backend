import { User } from 'src/modules/user/entities/User';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Injectable()
export class UserRepository {
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
