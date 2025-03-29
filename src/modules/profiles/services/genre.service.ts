import { Injectable, Logger } from '@nestjs/common';
import { Genre } from '@prisma/client';
import { GenreRepository } from '../repositories/genre.repository';
import { AppException } from '@/errors/appException';

@Injectable()
export class GenreService {
  constructor(private readonly genreRepository: GenreRepository) {}

  async findAll(): Promise<Genre[]> {
    Logger.log('Finding all genres', 'GenreService');
    return await this.genreRepository.findAll();
  }

  async verifyIfGenreExists(genreId: number): Promise<void> {
    Logger.log('Verifying if genre exists', 'GenreService');
    const genre = await this.genreRepository.findById(genreId);
    if (!genre) {
      Logger.error('Genre not found', 'GenreService');
      throw new AppException({
        error: 'Not found',
        message: 'genre not found',
        statusCode: 404,
      });
    }
    return;
  }

  async verifyIfGenresExists(genreIds: number[]): Promise<void> {
    Logger.log('Verifying if genres exists', 'GenreService');
    const genres = await this.genreRepository.findMany(genreIds);
    if (genres.length !== genreIds.length) {
      Logger.error('Genre not found', 'GenreService');
      throw new AppException({
        error: 'Not found',
        message: 'genre not found',
        statusCode: 404,
      });
    }
    return;
  }
}
