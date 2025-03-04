import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infra/database/database.module';
import { GenreController } from '@modules/profiles/controllers/genre.controller';
import { GenreService } from '@modules/profiles/services/genre.service';
import { SpecialityService } from '@modules/profiles/services/speciality.service';
import { SpecialityController } from '@modules/profiles/controllers/speciality.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [GenreController, SpecialityController],
  providers: [GenreService, SpecialityService],
})
export class ProfileModule {}
