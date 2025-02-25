import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/UserReposoitory';
import { User } from '../entities/User';

interface CreateUserUseCaseRequest {
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, password }: CreateUserUseCaseRequest) {
    const user = new User({
      email: email,
      password: password,
    });

    await this.userRepository.create(user);
  }
}
