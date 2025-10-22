import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { GroupChatMemberGuard } from 'src/guards/group-chat-member.guard';
import { QueryPipe } from 'src/pipes/query.pipe';
import { Query as QueryType } from 'src/types/query';

@Controller('group-chats/:groupChatId/messages')
export class GroupChatMessagesController {
  constructor(private messagesService: MessagesService) {}

  @UseGuards(GroupChatMemberGuard)
  @Get()
  async getGroupChatMessages(
    @Param('groupChatId') groupChatId: string,
    @Query(new QueryPipe()) query: QueryType,
  ) {
    return this.messagesService.getMessagesByGroupChatId(groupChatId, query);
  }
}
