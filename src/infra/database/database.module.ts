import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserRepository } from 'src/modules/user/repositories/UserRepository';

@Module({
  providers: [PrismaService, UserRepository],
})
export class DatabaseModule {}
