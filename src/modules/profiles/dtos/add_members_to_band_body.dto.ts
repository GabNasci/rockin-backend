import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class AddMembersToBandBodyDTO {
  @IsNotEmpty()
  @IsInt()
  profileId: number;
  @IsNotEmpty()
  @IsInt()
  bandId: number;

  @IsNotEmpty()
  @IsInt({ each: true })
  @IsArray()
  members: number[];
}
