import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './infra/database/database.module';
import { ProfileModule } from './modules/profiles/profile.module';

@Module({
  imports: [UserModule, DatabaseModule, ProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
