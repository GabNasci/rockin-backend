import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from '@modules/posts/services/post.service';
import { AuthGuard } from '@modules/auth/guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AppException } from '@/errors/appException';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RequestUserPayloadDTO } from '@modules/profiles/dtos/request_user_payload.dto';
import { CreatePostBodyDTO } from '../dtos/create_post_body.dto';
import { OptionalAuthGuard } from '@modules/auth/guards/optional-auth.guard';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(OptionalAuthGuard)
  @Get()
  async getAllPosts(@Request() req: RequestUserPayloadDTO) {
    Logger.log('/posts', 'GET');
    return await this.postService.findAll(req?.user?.profileId);
  }

  @UseGuards(AuthGuard)
  @Post('/:postId/like')
  @HttpCode(200)
  async likePost(
    @Param('postId') postId: number,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log(`/posts/${postId}/like`, 'POST');
    await this.postService.likePost(req.user.profileId, postId);
  }

  @UseGuards(AuthGuard)
  @Delete('/:postId/like')
  @HttpCode(200)
  async unlikePost(
    @Param('postId') postId: number,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log(`/posts/${postId}/like`, 'POST');
    await this.postService.unlikePost(req.user.profileId, postId);
  }

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(201)
  @UseInterceptors(
    FilesInterceptor('medias', 10, {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          cb(null, true);
        } else {
          cb(
            new AppException({
              error: 'Bad Request',
              message: 'Only image files are allowed',
              statusCode: 400,
            }),
            false,
          );
        }
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async createPost(
    @UploadedFiles() medias: Express.Multer.File[],
    @Request() req: RequestUserPayloadDTO,
    @Body()
    body: CreatePostBodyDTO,
  ) {
    Logger.log('/posts -> createPost', 'POST');
    await this.postService.create(
      req.user.profileId,
      body.text,
      body.link,
      body.tagged_profiles,
      medias,
    );
  }

  @UseGuards(OptionalAuthGuard)
  @Get('/profile/:profileId')
  async findPostsByProfileId(
    @Param('profileId') profileId: number,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log(`posts/profile/${profileId}`, 'GET');
    return await this.postService.finAllByProfileId(
      profileId,
      req?.user?.profileId,
    );
  }

  @Post('/link-preview')
  async getLinkPreview(@Body('link') link: string) {
    Logger.log('/posts/link-preview', 'POST');
    return await this.postService.getLinkPreview(link);
  }

  @UseGuards(AuthGuard)
  @Delete('/:postId')
  @HttpCode(200)
  async deletePost(
    @Param('postId') postId: number,
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log(`/posts/${postId}`, 'DELETE');
    await this.postService.deletePost(req.user.profileId, postId);
  }
}
