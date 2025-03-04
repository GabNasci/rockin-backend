import { Module } from '@nestjs/common';
import { UserController } from '@modules/user/controllers/user.controller';
import { UserService } from '@modules/user/services/user.service';
import { DatabaseModule } from '@infra/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
