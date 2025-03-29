import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { AppException } from 'src/errors/appException';
import { CreateUserResponseDTO } from '../dtos/createUserResponse.dto';
import { CreateUserBodyDTO } from '../dtos/createUserBody.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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

  async validateUser(email: string, password: string) {
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

    return user;
  }
}
