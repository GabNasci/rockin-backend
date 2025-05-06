import { Injectable } from '@nestjs/common';
import { ImageRepository } from '../repositories/image.repository';

@Injectable()
export class FileService {
  constructor(private readonly imageRepository: ImageRepository) {}
}
