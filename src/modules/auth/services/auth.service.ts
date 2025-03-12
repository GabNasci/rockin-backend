import { UserService } from '@modules/user/services/user.service';
import { Injectable, Logger } from '@nestjs/common';
import { LoginUserResponseDTO } from '../dtos/login_user_response.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(email: string, password: string): Promise<LoginUserResponseDTO> {
    Logger.log('Login user', 'AuthService');
    const user = await this.userService.validateUser(email, password);
    return {
      token: 'token',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
