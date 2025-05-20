import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

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
  tagged_profiles?: string[];
}
