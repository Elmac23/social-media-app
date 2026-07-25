import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GroupChatsService } from './group-chats.service';
import { AuthenticationGuard } from 'src/guards/authentication';
import { UserId } from 'src/decorators/user-id';
import { QueryType, QueryWithOrderedBy } from 'src/types/query';
import { QueryPipe } from 'src/pipes/query.pipe';
import {
  groupChatOrderByKeys,
  GroupChatOrderByKeys,
} from './group-chats.schema';

@Controller('users/:userId/group-chats')
export class UserGroupChatsController {
  constructor(private groupChatsService: GroupChatsService) {}
  @Get()
  @UseGuards(AuthenticationGuard)
  async getUsersGroupChats(
    @UserId() userId: string,
    @Query(new QueryPipe(groupChatOrderByKeys))
    query: QueryWithOrderedBy<GroupChatOrderByKeys>,
  ) {
    console.log(query);
    return this.groupChatsService.getUsersGroupChats(userId, query);
  }
}
