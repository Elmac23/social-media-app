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
import { GroupChatsService } from '../group-chats/group-chats.service';

type UserWrittingMessagePayload = {
  groupChatId: string;
  userId: string;
};

@Injectable()
@WebSocketGateway(81, { cors: { origin: '*' } })
@UseGuards(WebSocketAuthenticationGuard)
export class MessagesGateway {
  @WebSocketServer()
  server: Socket;

  constructor(
    private messagesService: MessagesService,
    private groupChatsService: GroupChatsService,
    private usersService: UsersService,
  ) {}

  // @SubscribeMessage('join-room')
  // @UseGuards(WebSocketAuthenticationGuard)
  // async handleJoinRoom(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() data: { groupChatId: string },
  // ) {
  //   console.log(`Client joining room: ${data.groupChatId}`);
  //   client.join(data.groupChatId);
  // }

  // @SubscribeMessage('exit-room')
  // @UseGuards(WebSocketAuthenticationGuard)
  // async handleExitRoom(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() data: { groupChatId: string },
  // ) {
  //   console.log(`Client leaving room: ${data.groupChatId}`);
  //   client.leave(data.groupChatId);
  // }

  @SubscribeMessage('user-writting')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleWrittingStart(
    @SocketClientId() userId: string,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UserWrittingMessagePayload,
  ) {
    const user = await this.usersService.getUserByIdOrLogin(userId);
    client
      .to(data.groupChatId)
      .emit('user-writting', { user, groupChatId: data.groupChatId });
  }

  @SubscribeMessage('groupchat-add')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleAddToGroupchat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: NotificationDto,
    @SocketClientId() senderId: string,
  ) {
    const addedUser = await this.usersService.getUserByIdOrLogin(data.userId);

    const textContent =
      addedUser.name && addedUser.lastname
        ? `${addedUser.name} ${addedUser.lastname}`
        : addedUser.login;

    const message = await this.messagesService.createMessage({
      senderId,
      content: textContent,
      type: 'SYSTEM_ADD_USER',
      groupChatId: data.entityId,
    });

    const sender = await this.usersService.getUserByIdOrLogin(senderId);

    client.to(data.entityId).emit('new-message', { ...message, sender });
    client.to(data.userId).emit('added-to-groupchat', data.entityId);
  }

  @SubscribeMessage('groupchat-remove')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleRemoveFromGroupchat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: NotificationDto,
    @SocketClientId() senderId,
  ) {
    const removedUser = await this.usersService.getUserByIdOrLogin(data.userId);

    const textContent =
      removedUser.name && removedUser.lastname
        ? `${removedUser.name} ${removedUser.lastname}`
        : removedUser.login;

    const message = await this.messagesService.createMessage({
      senderId,
      content: textContent,
      type: 'SYSTEM_REMOVE_USER',
      groupChatId: data.entityId,
    });

    const sender = await this.usersService.getUserByIdOrLogin(senderId);

    client.to(data.entityId).emit('new-message', { ...message, sender });
    client.to(data.userId).emit('remove-from-groupchat', data.entityId);
  }

  @SubscribeMessage('user-stopped-writting')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleStopWrittingStart(
    @SocketClientId() userId: string,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UserWrittingMessagePayload,
  ) {
    const user = await this.usersService.getUserByIdOrLogin(userId);
    client
      .to(data.groupChatId)
      .emit('user-stopped-writting', { user, groupChatId: data.groupChatId });
  }

  @SubscribeMessage('join-all-rooms')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleConnection(
    @SocketClientId() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (!client) {
      return;
    }
    const userChats = await this.groupChatsService.getUsersGroupChats(userId);
    userChats.data.forEach((chat) => {
      client.join(chat.id);
    });
  }

  @SubscribeMessage('exit-all-rooms')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleExit(
    @SocketClientId() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (!client) {
      return;
    }
    const userChats = await this.groupChatsService.getUsersGroupChats(userId);
    userChats.data.forEach((chat) => {
      client.leave(chat.id);
    });
  }

  @SubscribeMessage('send-message')
  @UseGuards(WebSocketAuthenticationGuard)
  async handlePostComment(
    @SocketClientId() userId: string,
    @ConnectedSocket() client: Socket,
    @MessageBody(new ZodValidationPipe(createMessageSchema))
    data: CreateMessageDto,
  ) {
    const message = await this.messagesService.createMessage({
      ...data,
      senderId: userId,
    });
    const sender = await this.usersService.getUserByIdOrLogin(userId);

    client.to(data.groupChatId).emit('new-message', {
      ...data,
      sender,
      createdAt: message.createdAt,
      type: 'DEFAULT',
    });
    client.emit('self-chat-top', { ...data });
  }
}
