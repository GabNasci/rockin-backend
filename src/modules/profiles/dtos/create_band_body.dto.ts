import { HANDLE_REGEX, NAME_REGEX } from '@/constants/regex';
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

export class AddBandBodyDTO {
  @IsString()
  @Matches(NAME_REGEX, {
    message: 'Name must contain only letters and spaces',
  })
  @MaxLength(50)
  @MinLength(2)
  @IsNotEmpty()
  name: string;

  @Matches(HANDLE_REGEX, {
    message:
      'Handler must contain only letters, numbers, underscores, and periods',
  })
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(2)
  handle: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  genres?: number[];
}
