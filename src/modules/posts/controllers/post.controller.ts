import {
  Body,
  Controller,
  Get,
  Logger,
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
  @UseInterceptors(
    FilesInterceptor('files', 10, {
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
  createPost(
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: RequestUserPayloadDTO,
  ) {
    Logger.log('/posts -> createPost', 'POST');

    console.log(
      'Arquivos recebidos:',
      files.map((f) => f.originalname),
    );

    return { message: 'Post criado com sucesso!' };
  }
}
