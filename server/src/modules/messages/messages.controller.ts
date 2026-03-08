import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  @UseGuards(AuthenticationGuard, AdminGuard)
  async getMessages(
    @Query(new QueryPipe(messageOrderByKeys))
    query: QueryWithOrderedBy<MessageOrderByKeys>,
  ) {
    return this.messagesService.getMessages(query);
  }

  @Post()
  async createMessage(
    @Body(new ZodValidationPipe(createMessageSchema)) body: CreateMessageDto,
  ) {
    return this.messagesService.createMessage(body);
  }
}
