import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { Prisma, users } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: Prisma.usersCreateInput): Promise<users> {
    const createdUser = await this.prisma.users.create({
      data: {
        email: user.email,
        password: user.password,
      },
    });

    return createdUser;
  }
  async findByEmail(email: string): Promise<users | null> {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }
    return user;
  }

  async findById(id: number): Promise<users | null> {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }
}
