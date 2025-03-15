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

export const NAME_REGEX = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/;

export const HANDLER_REGEX = /^@[a-zA-Z0-9._]+$/;

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

  @Matches(HANDLER_REGEX, {
    message:
      'Handler must start with @ and contain only letters, numbers, underscores, and periods',
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
