import { Module } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { GenreRepository } from '@modules/profiles/repositories/genre.repository';
import { SpecialityRepository } from '@modules/profiles/repositories/speciality.repository';
import { ProfileRepository } from '@modules/profiles/repositories/profile.repository';
import { ProfileTypeRepository } from '@modules/profiles/repositories/profile_type.repository';
import { BandRepository } from '@modules/profiles/repositories/band.repository';

@Module({
  providers: [
    PrismaService,
    UserRepository,
    GenreRepository,
    SpecialityRepository,
    ProfileRepository,
    ProfileTypeRepository,
    BandRepository,
  ],
  exports: [
    PrismaService,
    UserRepository,
    GenreRepository,
    SpecialityRepository,
    ProfileRepository,
    ProfileTypeRepository,
    BandRepository,
  ],
})
export class DatabaseModule {}
