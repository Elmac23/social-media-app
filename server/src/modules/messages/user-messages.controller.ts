import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import {
  CreateMessageDto,
  createMessageSchema,
  messageOrderByKeys,
  MessageOrderByKeys,
} from './messages.schema';
import { ZodValidationPipe } from 'src/pipes/ZodValidationPipe';
import { AuthenticationGuard } from 'src/guards/authentication';
import { AdminGuard } from 'src/guards/admin';
import { QueryPipe } from 'src/pipes/query.pipe';
import { QueryType, QueryWithOrderedBy } from 'src/types/query';

@Controller('users/:id/messages')
export class UserMessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  @UseGuards(AuthenticationGuard, AdminGuard)
  async getMessages(
    @Param('id') userId,
    @Query(new QueryPipe(messageOrderByKeys))
    query: QueryWithOrderedBy<MessageOrderByKeys>,
  ) {
    return this.messagesService.getUserMessages(userId, query);
  }
}
