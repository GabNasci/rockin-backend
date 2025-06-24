import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { HANDLE_REGEX, NAME_REGEX } from '@/constants/regex';

export class UpdateProfileBodyDTO {
  @IsString()
  @Matches(NAME_REGEX, {
    message: 'Name must contain only letters and spaces',
  })
  @MaxLength(50)
  @MinLength(2)
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(250)
  about?: string;

  @IsString()
  @Matches(HANDLE_REGEX, {
    message:
      'Handler must contain only letters, numbers, underscores, and periods',
  })
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(2)
  handle: string;

  @IsArray()
  @IsInt({ each: true })
  specialities: number[];

  @IsArray()
  @IsInt({ each: true })
  genres: number[];
}
