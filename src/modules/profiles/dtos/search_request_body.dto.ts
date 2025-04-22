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
  @IsInt({ each: true })
  specialities?: number[];
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  genres?: number[];
}
