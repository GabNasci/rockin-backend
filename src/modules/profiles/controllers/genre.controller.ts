import { Controller, Get, Logger } from '@nestjs/common';
import { GenreService } from '@modules/profiles/services/genre.service';

@Controller('genres')
export class GenreController {
  constructor(private genreService: GenreService) {}

  @Get()
  async getAllGenres() {
    Logger.log('/genres', 'GET');
    return await this.genreService.findAll();
  }
}
