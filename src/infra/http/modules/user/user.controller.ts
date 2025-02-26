import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateUserUseCase } from 'src/modules/user/useCases/createUserUseCase';
import { CreateUserBodyDTO } from './dtos/CreateUserBodyDTO';
@Controller('users')
export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  async createUser(@Body() body: CreateUserBodyDTO) {
    Logger.log('/users', 'POST');
    Logger.log(`Creating user with email ${body.email}`);
    const { email, password } = body;

    const user = await this.createUserUseCase.execute({
      email,
      password,
    });

    return user;
  }
}
