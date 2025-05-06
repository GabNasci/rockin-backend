import { forwardRef, Module } from '@nestjs/common';
import { UserController } from '@modules/user/controllers/user.controller';
import { UserService } from '@modules/user/services/user.service';
import { DatabaseModule } from '@infra/database/database.module';
import { UserRepository } from './repositories/user.repository';
import { ProfileModule } from '@modules/profiles/profile.module';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => ProfileModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
