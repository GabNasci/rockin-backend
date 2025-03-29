import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UserService } from '@modules/user/services/user.service';
import { AuthService } from './services/auth.service';
import { DatabaseModule } from '@infra/database/database.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [UserService, AuthService],
})
export class AuthModule {}
