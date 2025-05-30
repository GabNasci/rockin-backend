import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateConversationDto {
  @IsNumber()
  @IsNotEmpty()
  targetId: number;
}
