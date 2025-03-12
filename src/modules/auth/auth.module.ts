import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UserService } from '@modules/user/services/user.service';
import { AuthService } from './services/auth.service';
import { DatabaseModule } from '@infra/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [UserService, AuthService],
})
export class AuthModule {}
