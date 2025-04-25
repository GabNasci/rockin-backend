import { UserService } from '@modules/user/services/user.service';
import { Injectable, Logger } from '@nestjs/common';
import { LoginUserResponseDTO } from '../dtos/login_user_response.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadDTO } from '../dtos/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginUserResponseDTO> {
    Logger.log('Login user', 'AuthService');
    const user = await this.validateUser(email, password);
    const token = await this.generateToken({
      id: user.id,
      email: user.email,
      profileId: user.profileId,
    });
    return {
      token: token,
      user: {
        id: user.id,
        email: user.email,
        profileId: user.profileId,
      },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.validateUser(email, password);
    return user;
  }

  async generateToken(payload: PayloadDTO) {
    return this.jwtService.signAsync(payload);
  }
}
