import { Module } from '@nestjs/common';
import { UserModule } from '@modules/user/user.module';
import { DatabaseModule } from '@infra/database/database.module';
import { ProfileModule } from '@modules/profiles/profile.module';
import { PostModule } from '@modules/posts/post.module';

@Module({
  imports: [UserModule, DatabaseModule, ProfileModule, PostModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
