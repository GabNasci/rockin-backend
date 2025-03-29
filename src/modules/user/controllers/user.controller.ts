import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UserService } from '@modules/user/services/user.service';
import { CreateUserBodyDTO } from '@modules/user/dtos/createUserBody.dto';
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() body: CreateUserBodyDTO) {
    Logger.log('/users', 'POST');
    Logger.log(`Creating user with email ${body.email}`);
    const { email, password } = body;

    const user = await this.userService.create({
      email,
      password,
    });

    return user;
  }
}
