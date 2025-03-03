import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories/UserRepository';
import { AppException } from 'src/errors/appException';
import { CreateUserResponseDTO } from '../dtos/createUserResponse.dto';

interface CreateUserUseCaseRequest {
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserResponseDTO> {
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
}
