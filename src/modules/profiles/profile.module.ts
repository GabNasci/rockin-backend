import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infra/database/database.module';
import { GenreController } from '@modules/profiles/controllers/genre.controller';
import { GenreService } from '@modules/profiles/services/genre.service';
import { SpecialityService } from '@modules/profiles/services/speciality.service';
import { SpecialityController } from '@modules/profiles/controllers/speciality.controller';
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
})
export class ProfileModule {}
