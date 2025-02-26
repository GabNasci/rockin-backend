import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserRepository } from 'src/modules/user/repositories/UserRepository';
import { GenreRepository } from 'src/modules/profiles/repositories/GenreRepository';

@Module({
  providers: [PrismaService, UserRepository, GenreRepository],
  exports: [PrismaService, UserRepository, GenreRepository],
})
export class DatabaseModule {}
