import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { UserInvitesController } from './user-invites.controller';
import { UserFollowersModule } from '../users/user-followers/user-followers.module';
import { GroupChatsModule } from '../group-chats/group-chats.module';

@Module({
  imports: [UserFollowersModule, GroupChatsModule],
  providers: [InvitesService],
  controllers: [InvitesController, UserInvitesController],
})
export class InvitesModule {}
