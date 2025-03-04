import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infra/database/database.module';
import { GenreController } from '@modules/profiles/controllers/genre.controller';
import { GenreService } from '@modules/profiles/services/genre.service';
import { SpecialityService } from '@modules/profiles/services/speciality.service';
import { SpecialityController } from '@modules/profiles/controllers/speciality.controller';
<<<<<<< HEAD
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { ProfileTypeService } from './services/profile_type.service';

@Module({
  imports: [DatabaseModule],
  controllers: [GenreController, SpecialityController, ProfileController],
  providers: [
    GenreService,
    SpecialityService,
    ProfileService,
    ProfileTypeService,
  ],
=======

@Module({
  imports: [DatabaseModule],
  controllers: [GenreController, SpecialityController],
  providers: [GenreService, SpecialityService],
>>>>>>> 82b537ca63650e80ddf42e3b546af848bc6cc802
})
export class ProfileModule {}
