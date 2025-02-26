import { Module } from '@nestjs/common';
import { UserModule } from './infra/http/modules/user/user.module';
import { DatabaseModule } from './infra/database/database.module';
import { ProfileModule } from './infra/http/modules/profile/profile.module';

@Module({
  imports: [UserModule, DatabaseModule, ProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
