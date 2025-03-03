import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infra/database/database.module';
import { PostController } from '@modules/posts/controllers/post.controller';
import { PostService } from '@modules/posts/services/post.service';
import { PostRepository } from './repositories/post.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
