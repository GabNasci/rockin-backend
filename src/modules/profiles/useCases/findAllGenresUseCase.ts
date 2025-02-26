import { Injectable, Logger } from '@nestjs/common';
import { GenreRepository } from '../repositories/GenreRepository';

@Injectable()
export class FindAllGenresUseCase {
  constructor(private genreRepository: GenreRepository) {}

  async execute() {
    Logger.log('Finding all genres', 'FindAllGenresUseCase');
    return await this.genreRepository.findAll();
  }
}
