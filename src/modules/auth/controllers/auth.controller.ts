import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { UserService } from '@modules/user/services/user.service';
import { LoginUserBodyDTO } from '../dtos/login_user_body.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginUserBodyDTO) {
    Logger.log('/auth/login', 'POST');
    const { email, password } = body;
    return this.authService.login(email, password);
  }
}
