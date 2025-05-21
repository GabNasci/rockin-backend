import {
  IsOptional,
  IsString,
  MaxLength,
  IsUrl,
  IsArray,
  IsNumber,
  ArrayMaxSize,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostBodyDTO {
  @IsOptional()
  @IsString()
  @MaxLength(250)
  text?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(250)
  link?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMaxSize(5)
  @Transform(({ value }) => {
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      return Array.isArray(parsed) ? parsed.map(Number) : [];
    } catch {
      return [];
    }
  })
  tagged_profiles?: number[];
}
