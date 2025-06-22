import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class AddMembersToBandBodyDTO {
  @IsNotEmpty()
  @IsInt({ each: true })
  @IsArray()
  members: number[];
}
