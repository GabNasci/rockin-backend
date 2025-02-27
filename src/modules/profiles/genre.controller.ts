import { Controller, Get, Logger } from '@nestjs/common';
import { FindAllGenresUseCase } from 'src/modules/profiles/useCases/findAllGenresUseCase';

@Controller('genres')
export class GenreController {
  constructor(private findAllGenresUseCase: FindAllGenresUseCase) {}

  @Get()
  async createUser() {
    Logger.log('/genres', 'GET');
    return await this.findAllGenresUseCase.execute();
  }
}
