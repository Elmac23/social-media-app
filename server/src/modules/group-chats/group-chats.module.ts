import { Module } from '@nestjs/common';
import { GroupChatsService } from './group-chats.service';
import { GroupChatsController } from './group-chats.controller';
import { UserGroupChatsController } from './user-group-chats.controller';

@Module({
  imports: [],
  providers: [GroupChatsService],
  controllers: [GroupChatsController, UserGroupChatsController],
  exports: [GroupChatsService],
})
export class GroupChatsModule {}
