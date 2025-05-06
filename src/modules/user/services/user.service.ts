import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { AppException } from 'src/errors/appException';
import { CreateUserResponseDTO } from '../dtos/createUserResponse.dto';
import { CreateUserBodyDTO } from '../dtos/createUserBody.dto';
import * as bcrypt from 'bcryptjs';
import { ProfileRepository } from '@modules/profiles/repositories/profile.repository';
import { Profile } from '@prisma/client';
import { ProfileService } from '@modules/profiles/services/profile.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly profileService: ProfileService,
  ) {}

  async create({
    email,
    password,
  }: CreateUserBodyDTO): Promise<CreateUserResponseDTO> {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      Logger.log(`User found: ${user?.id}`);
      Logger.error('email already registered');

      throw new AppException({
        message: 'email already registered',
        statusCode: 400,
      });
    }

    const userCreated = await this.userRepository.create({ email, password });

    return new CreateUserResponseDTO(userCreated);
  }

  async validateUser(email: string, password: string, profileId?: number) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      Logger.log(`User not found: ${email}`);
      Logger.error('email not found');
      throw new AppException({
        error: 'Unauthorized',
        message: 'invalid credentials',
        statusCode: 401,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      Logger.log(`User found: ${user?.id}`);
      Logger.error('password not match');
      throw new AppException({
        error: 'Unauthorized',
        message: 'invalid credentials',
        statusCode: 401,
      });
    }

    let profile: Profile | null;

    if (profileId) {
      await this.profileService.verifyIfUserIsOwner(profileId, user.id);
      profile = await this.profileRepository.findById(profileId);
    } else {
      profile = await this.profileRepository.findByUserId(user.id);
    }

    if (!profile) {
      Logger.log(`User not found: ${user?.id}`);
      Logger.error('profile not found');
      throw new AppException({
        error: 'Unauthorized',
        message: 'invalid credentials',
        statusCode: 401,
      });
    }

    return {
      ...user,
      profileId: profile.id,
    };
  }
}
