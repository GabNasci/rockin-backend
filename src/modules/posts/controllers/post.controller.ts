import {
  Body,
  Controller,
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

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async getAllPosts() {
    Logger.log('/posts', 'GET');
    return await this.postService.findAll();
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
    Logger.log(body);
    Logger.log(medias);
    await this.postService.create(
      req.user.profileId,
      body.text,
      body.link,
      body.tagged_profiles,
      medias,
    );
  }
  @Get('/profile/:profileId')
  async findPostsByProfileId(@Param('profileId') profileId: number) {
    Logger.log(`posts/profile/${profileId}`, 'GET');
    return await this.postService.finAllByProfileId(profileId);
  }
}
