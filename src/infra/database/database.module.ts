import { Module } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { UserRepository } from '@modules/user/repositories/UserRepository';
import { GenreRepository } from '@modules/profiles/repositories/genre.repository';
import { SpecialityRepository } from '@modules/profiles/repositories/speciality.repository';

@Module({
  providers: [
    PrismaService,
    UserRepository,
    GenreRepository,
    SpecialityRepository,
  ],
  exports: [
    PrismaService,
    UserRepository,
    GenreRepository,
    SpecialityRepository,
  ],
})
export class DatabaseModule {}
