import {
  IsArray,
  IsInt,
  IsNotEmpty,
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

  about: string;

  @Matches(HANDLE_REGEX, {
    message:
      'Handler must contain only letters, numbers, underscores, and periods',
  })
  @IsNotEmpty()
  handle: string;

  @IsArray()
  @IsInt({ each: true })
  specialities: number[];

  @IsArray()
  @IsInt({ each: true })
  genres: number[];
}
