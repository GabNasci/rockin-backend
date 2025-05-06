import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { DatabaseModule } from '@infra/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfileModule } from '@modules/profiles/profile.module';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => ProfileModule),
    forwardRef(() => UserModule),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
