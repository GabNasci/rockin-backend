import { Injectable, Logger } from '@nestjs/common';
import { Genre } from '@prisma/client';
import { GenreRepository } from '../repositories/genre.repository';

@Injectable()
export class GenreService {
  constructor(private readonly genreRepository: GenreRepository) {}

  async findAll(): Promise<Genre[]> {
    Logger.log('Finding all genres', 'GenreService');
    return await this.genreRepository.findAll();
  }
}
