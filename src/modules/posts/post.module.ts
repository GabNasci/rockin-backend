import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infra/database/database.module';
import { PostController } from '@modules/posts/controllers/post.controller';
import { PostService } from '@modules/posts/services/post.service';
import { PostRepository } from './repositories/post.repository';
import { MediaRepository } from './repositories/media.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [PostController],
  providers: [PostService, PostRepository, MediaRepository],
})
export class PostModule {}
