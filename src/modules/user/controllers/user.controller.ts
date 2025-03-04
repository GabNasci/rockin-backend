import { Body, Controller, Logger, Post } from '@nestjs/common';
<<<<<<< HEAD
import { UserService } from '@modules/user/services/user.service';
import { CreateUserBodyDTO } from '@modules/user/dtos/createUserBody.dto';
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
=======
import { CreateUserUseCase } from '@modules/user/services/createUserUseCase';
import { CreateUserBodyDTO } from '@modules/user/dtos/createUserBody.dto';
@Controller('users')
export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}
>>>>>>> 82b537ca63650e80ddf42e3b546af848bc6cc802

  @Post()
  async createUser(@Body() body: CreateUserBodyDTO) {
    Logger.log('/users', 'POST');
    Logger.log(`Creating user with email ${body.email}`);
    const { email, password } = body;

<<<<<<< HEAD
    const user = await this.userService.create({
=======
    const user = await this.createUserUseCase.execute({
>>>>>>> 82b537ca63650e80ddf42e3b546af848bc6cc802
      email,
      password,
    });

    return user;
  }
}
