import { Module } from '@nestjs/common';
import { UserController } from '@modules/user/controllers/user.controller';
<<<<<<< HEAD
import { UserService } from '@modules/user/services/user.service';
=======
import { CreateUserUseCase } from '@modules/user/services/createUserUseCase';
>>>>>>> 82b537ca63650e80ddf42e3b546af848bc6cc802
import { DatabaseModule } from '@infra/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
<<<<<<< HEAD
  providers: [UserService],
=======
  providers: [CreateUserUseCase],
>>>>>>> 82b537ca63650e80ddf42e3b546af848bc6cc802
})
export class UserModule {}
