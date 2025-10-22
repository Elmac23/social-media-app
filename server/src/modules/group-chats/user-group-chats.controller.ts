import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GroupChatsService } from './group-chats.service';
import { AuthenticationGuard } from 'src/guards/authentication';
import { UserId } from 'src/decorators/user-id';
import { Query as QueryType } from 'src/types/query';
import { QueryPipe } from 'src/pipes/query.pipe';

@Controller('users/:userId/group-chats')
export class UserGroupChatsController {
  constructor(private groupChatsService: GroupChatsService) {}
  @Get()
  @UseGuards(AuthenticationGuard)
  async getUsersGroupChats(
    @UserId() userId: string,
    @Query(new QueryPipe()) query: QueryType,
  ) {
    return this.groupChatsService.getUsersGroupChats(userId, query);
  }
}
