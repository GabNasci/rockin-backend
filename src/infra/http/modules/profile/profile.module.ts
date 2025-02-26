import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { GenreController } from './genre.controller';
import { FindAllGenresUseCase } from 'src/modules/profiles/useCases/findAllGenresUseCase';

@Module({
  imports: [DatabaseModule],
  controllers: [GenreController],
  providers: [FindAllGenresUseCase],
})
export class ProfileModule {}
