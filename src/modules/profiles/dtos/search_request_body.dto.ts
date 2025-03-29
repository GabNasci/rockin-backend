import {
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
  search: string;

  @IsNotEmpty()
  @IsNumber()
  radius: number;
}
