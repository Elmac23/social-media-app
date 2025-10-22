import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto, createMessageSchema } from './messages.schema';
import { ZodValidationPipe } from 'src/pipes/ZodValidationPipe';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}
  @Post()
  async createMessage(
    @Body(new ZodValidationPipe(createMessageSchema)) body: CreateMessageDto,
  ) {
    return this.messagesService.createMessage(body);
  }
}
