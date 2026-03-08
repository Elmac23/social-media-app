import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GroupChatsService } from './group-chats.service';
import {
  CreateGroupChatDto,
  createGroupChatSchema,
  groupChatOrderByKeys,
  GroupChatOrderByKeys,
  UpdateGroupChatDto,
  updateGroupChatSchema,
} from './group-chats.schema';
import { ZodValidationPipe } from 'src/pipes/ZodValidationPipe';
import { AuthenticationGuard } from 'src/guards/authentication';
import { UserId } from 'src/decorators/user-id';
import { GroupChatMemberGuard } from 'src/guards/group-chat-member.guard';
import { AdminGuard } from 'src/guards/admin';
import { QueryPipe } from 'src/pipes/query.pipe';
import { QueryType, QueryWithOrderedBy } from 'src/types/query';

@Controller('group-chats')
export class GroupChatsController {
  constructor(private groupChatsService: GroupChatsService) {}

  @Get()
  @UseGuards(AuthenticationGuard, AdminGuard)
  async getComments(
    @Query(new QueryPipe(groupChatOrderByKeys))
    query: QueryWithOrderedBy<GroupChatOrderByKeys>,
  ) {
    return await this.groupChatsService.getGroupChats(query);
  }

  @UseGuards(AuthenticationGuard, GroupChatMemberGuard)
  @Get(':id')
  async getGroupChatById(@Param('id') id: string) {
    return this.groupChatsService.getGroupChatById(id);
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  async createGroupChat(
    @Body(new ZodValidationPipe(createGroupChatSchema))
    createGroupChatDto: CreateGroupChatDto,
  ) {
    return await this.groupChatsService.createGroupChat(createGroupChatDto);
  }

  @Delete(':groupChatId/users/:userId')
  @UseGuards(AuthenticationGuard, GroupChatMemberGuard)
  async quitGroupChat(
    @Param('groupChatId') chatId: string,
    @Param('userId') userId: string,
  ) {
    return await this.groupChatsService.removeMember(chatId, userId);
  }

  @Post(':groupChatId/users/:userId')
  @UseGuards(AuthenticationGuard, GroupChatMemberGuard)
  async addMember(
    @Param('groupChatId') chatId: string,
    @Param('userId') userId: string,
  ) {
    return await this.groupChatsService.addMember(chatId, userId);
  }

  @Patch(':groupChatId')
  @UseGuards(AuthenticationGuard, GroupChatMemberGuard)
  async updateGroupChat(
    @Param('groupChatId') chatId: string,
    @Body(new ZodValidationPipe(updateGroupChatSchema))
    data: UpdateGroupChatDto,
  ) {
    return this.groupChatsService.updateGroupChat(chatId, data);
  }
}
