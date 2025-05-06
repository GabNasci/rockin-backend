import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateLocationBodyDTO } from './create_location_body.dto';
import { Type } from 'class-transformer';
import { HANDLE_REGEX, NAME_REGEX } from '@/constants/regex';

export class CreateProfileBodyDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsInt()
  profileTypeId: number;

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
  handle: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  specialities?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  genres?: number[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateLocationBodyDTO)
  location: CreateLocationBodyDTO;
}
