import { Injectable, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebSocketAuthenticationGuard } from 'src/guards/websocket-authentication';
import { ZodValidationPipe } from 'src/pipes/ZodValidationPipe';
import { CreateMessageDto, createMessageSchema } from './messages.schema';
import { SocketClientId } from 'src/decorators/socket-client-id';
import { NotificationDto } from '../notifications/notification.schema';
import { Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { Client } from 'socket.io/dist/client';

@Injectable()
@WebSocketGateway(81, { cors: { origin: '*' } })
@UseGuards(WebSocketAuthenticationGuard)
export class MessagesGateway {
  @WebSocketServer()
  server: Socket;

  constructor(
    private messagesService: MessagesService,
    private usersService: UsersService,
  ) {}

  @SubscribeMessage('join-room')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { groupChatId: string },
  ) {
    console.log(`Client joining room: ${data.groupChatId}`);
    client.join(data.groupChatId);
  }

  @SubscribeMessage('exit-room')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleExitRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { groupChatId: string },
  ) {
    console.log(`Client leaving room: ${data.groupChatId}`);
    client.leave(data.groupChatId);
  }

  @SubscribeMessage('send-message')
  @UseGuards(WebSocketAuthenticationGuard)
  async handlePostComment(
    @SocketClientId() userId: string,
    @ConnectedSocket() client: Socket,
    @MessageBody(new ZodValidationPipe(createMessageSchema))
    data: CreateMessageDto,
  ) {
    console.log('Received message data:', data);
    await this.messagesService.createMessage({ ...data, senderId: userId });
    const sender = await this.usersService.getUserByIdOrLogin(userId);

    client.broadcast
      .to(data.groupChatId)
      .emit('new-message', { ...data, sender });
  }
}
