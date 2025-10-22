import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { UsersModule } from '../users/users.module';
import { GroupChatMessagesController } from './group-chat-messages.controller';
import { MessagesGateway } from './messages.gateway';

@Module({
  imports: [UsersModule],
  providers: [MessagesService, MessagesGateway],
  controllers: [MessagesController, GroupChatMessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
