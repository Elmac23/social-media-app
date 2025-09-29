import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { UserInvitesController } from './user-invites.controller';
import { UserFollowersModule } from '../users/user-followers/user-followers.module';

@Module({
  imports: [UserFollowersModule],
  providers: [InvitesService],
  controllers: [InvitesController, UserInvitesController],
})
export class InvitesModule {}
