import { Controller, Get, Logger } from '@nestjs/common';
import { PostService } from '@modules/posts/services/post.service';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async getAllPosts() {
    Logger.log('/posts', 'GET');
    return await this.postService.findAll();
  }
}
