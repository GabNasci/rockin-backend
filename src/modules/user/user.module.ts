import { Module } from '@nestjs/common';
import { UserController } from '@modules/user/controllers/user.controller';
import { CreateUserUseCase } from '@modules/user/services/createUserUseCase';
import { DatabaseModule } from '@infra/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [CreateUserUseCase],
})
export class UserModule {}
