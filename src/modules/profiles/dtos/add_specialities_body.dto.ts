import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class AddSpecialitiesBodyDTO {
  @IsNotEmpty()
  @IsInt()
  profileId: number;

  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  specialityIds: number[];
}
