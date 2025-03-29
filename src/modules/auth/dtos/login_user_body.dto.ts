import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserBodyDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
