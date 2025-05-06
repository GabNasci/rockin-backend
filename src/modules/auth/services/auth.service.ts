import { UserService } from '@modules/user/services/user.service';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { LoginUserResponseDTO } from '../dtos/login_user_response.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadDTO } from '../dtos/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginUserResponseDTO> {
    Logger.log('Login user', 'AuthService');
    const user = await this.validateUser(email, password);
    const token = await this.generateToken({
      id: user.id,
      profileId: user.profileId,
    });
    return {
      token: token,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.validateUser(email, password);
    return user;
  }

  async generateToken(payload: PayloadDTO, expiresIn?: string | number) {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: expiresIn ?? process.env.JWT_EXPIRATION,
    });
  }
}
