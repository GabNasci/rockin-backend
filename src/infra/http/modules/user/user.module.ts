import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserUseCase } from 'src/modules/user/useCases/createUserUseCase';
import { DatabaseModule } from 'src/infra/database/database.module';
import { UserRepository } from 'src/modules/user/repositories/UserRepository';

@Module({
  imports: [DatabaseModule, UserRepository],
  controllers: [UserController],
  providers: [CreateUserUseCase],
})
export class UserModule {}
