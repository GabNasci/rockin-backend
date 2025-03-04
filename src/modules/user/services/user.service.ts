import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { AppException } from 'src/errors/appException';
import { CreateUserResponseDTO } from '../dtos/createUserResponse.dto';
import { CreateUserBodyDTO } from '../dtos/createUserBody.dto';

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
}
