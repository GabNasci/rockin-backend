import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchRequestBodyDTO {
  @IsNotEmpty()
  @IsInt()
  page: number;
  @IsNotEmpty()
  @IsInt()
  limit: number;
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsNumber()
  radius?: number;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialities?: string[];
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  profileTypes?: string[];
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];
}
