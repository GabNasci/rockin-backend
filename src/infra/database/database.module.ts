import { Module } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
<<<<<<< HEAD
import { UserRepository } from '@modules/user/repositories/user.repository';
import { GenreRepository } from '@modules/profiles/repositories/genre.repository';
import { SpecialityRepository } from '@modules/profiles/repositories/speciality.repository';
import { ProfileRepository } from '@modules/profiles/repositories/profile.repository';
import { ProfileTypeRepository } from '@modules/profiles/repositories/profile_type.repository';
=======
import { UserRepository } from '@modules/user/repositories/UserRepository';
import { GenreRepository } from '@modules/profiles/repositories/genre.repository';
import { SpecialityRepository } from '@modules/profiles/repositories/speciality.repository';
>>>>>>> 82b537ca63650e80ddf42e3b546af848bc6cc802

@Module({
  providers: [
    PrismaService,
    UserRepository,
    GenreRepository,
    SpecialityRepository,
<<<<<<< HEAD
    ProfileRepository,
    ProfileTypeRepository,
=======
>>>>>>> 82b537ca63650e80ddf42e3b546af848bc6cc802
  ],
  exports: [
    PrismaService,
    UserRepository,
    GenreRepository,
    SpecialityRepository,
<<<<<<< HEAD
    ProfileRepository,
    ProfileTypeRepository,
=======
>>>>>>> 82b537ca63650e80ddf42e3b546af848bc6cc802
  ],
})
export class DatabaseModule {}
