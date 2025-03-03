import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateUserUseCase } from '@modules/user/services/createUserUseCase';
import { CreateUserBodyDTO } from '@modules/user/dtos/createUserBody.dto';
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
