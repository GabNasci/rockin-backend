import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/UserReposoitory';
import { User } from '../entities/User';

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, email, password }: CreateUserUseCaseRequest) {
    const user = new User({
      name: name,
      email: email,
      password: password,
    });

    await this.userRepository.create(user);
  }
}
