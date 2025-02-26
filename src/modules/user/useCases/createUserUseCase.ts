import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories/UserRepository';
import { AppException } from 'src/exceptions/appException';

interface CreateUserUseCaseRequest {
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, password }: CreateUserUseCaseRequest) {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      Logger.log(`User found: ${user?.id}`);
      Logger.error('User already exists');
      throw new AppException({
        message: 'User already exists',
        status: 400,
      });
    }

    return await this.userRepository.create({ email, password });
  }
}
