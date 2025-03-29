import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class AddGenresBodyDTO {
  @IsNotEmpty()
  @IsInt()
  profileId: number;

  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  genreIds: number[];
}
