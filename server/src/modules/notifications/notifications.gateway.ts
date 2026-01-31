import { Injectable, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketClientId } from 'src/decorators/socket-client-id';
import { WebSocketAuthenticationGuard } from 'src/guards/websocket-authentication';
import { PostsService } from '../posts/posts.service';
import { Socket } from 'socket.io';
import {
  notificationCreateSchema,
  NotificationDto,
} from './notification.schema';
import { ZodValidationPipe } from 'src/pipes/ZodValidationPipe';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { NotificationType } from 'generated/prisma';
import { CommentsService } from '../comments/comments.service';
import {
  CreateMessageDto,
  createMessageSchema,
} from '../messages/messages.schema';

type PostNotificationPayload = {
  senderId: string;
  postId: string;
  userId: string;
  type: NotificationType;
};

type CommentNotificationPayload = {
  senderId: string;
  commentId: string;
  userId: string;
  type: NotificationType;
};

type InviteNotificationPayload = {
  senderId: string;
  userId: string;
  type: NotificationType;
};

type MessageNotificationPayload = {
  senderId: string;
  groupChatId: string;
  type: NotificationType;
};

type GroupChatNotificationPayload = {
  senderId: string;
  groupChatId: string;
  recipentId: string;
  type: NotificationType;
};

@Injectable()
@WebSocketGateway(81, { cors: { origin: '*' } })
@UseGuards(WebSocketAuthenticationGuard)
export class NotificationsGateway {
  @WebSocketServer()
  server: Socket;

  constructor(
    private postsService: PostsService,
    private notificationService: NotificationsService,
    private commentsService: CommentsService,
    private usersService: UsersService,
    private prismaService: PrismaService,
  ) {}

  async handleUserNotification({
    senderId,
    type,
    userId,
  }: InviteNotificationPayload) {
    let redirectUrl = '';

    switch (type) {
      case 'FRIEND_REQUEST':
      case 'FRIEND_REQUEST_ACCEPTED':
      case 'NEW_FOLLOWER':
        redirectUrl = `/profile/${senderId}`;
        break;
      default:
        redirectUrl = `/`;
    }

    const response = await this.notificationService.createNotification({
      entityId: senderId,
      notificationType: type,
      userId,
      redirectUrl,
      senderId,
    });

    if (!response) return;

    const sender = await this.usersService.getUserByIdOrLogin(senderId);

    this.server.to(userId).emit('notification', { ...response, sender });
  }

  async handleMessageNotification({
    senderId,
    type,
    groupChatId,
  }: MessageNotificationPayload) {
    let redirectUrl = '';

    switch (type) {
      case 'NEW_MESSAGE':
        redirectUrl = `/chat/${groupChatId}`;
        break;

      default:
        redirectUrl = `/`;
    }

    const groupChat = await this.prismaService.groupChat.findUnique({
      where: { id: groupChatId },
      include: { usersInGroupChat: true },
    });
    if (!groupChat) return;

    groupChat.usersInGroupChat.forEach(async (member) => {
      if (member.userId === senderId) return;
      const response = await this.notificationService.createNotification({
        entityId: groupChatId,
        notificationType: type,
        userId: member.userId,
        entityName: groupChat.name,
        redirectUrl,
        senderId,
      });

      if (!response) return;

      const sender = await this.usersService.getUserByIdOrLogin(senderId);

      this.server.to(member.userId).emit('notification', {
        ...response,
        sender,
        entityName: groupChat.name,
        groupChatName: groupChat.name,
      });
    });
  }

  async handleGroupchatMembership({
    groupChatId,
    recipentId,
    senderId,
    type,
  }: GroupChatNotificationPayload) {
    let redirectUrl = '';

    switch (type) {
      case 'GROUPCHAT_ADDED':
        redirectUrl = `/chat/${groupChatId}`;
        break;

      default:
        redirectUrl = `/`;
    }

    const groupChat = await this.prismaService.groupChat.findUnique({
      where: { id: groupChatId },
      include: { usersInGroupChat: true },
    });
    if (!groupChat) return;

    if (recipentId === senderId) return;
    const response = await this.notificationService.createNotification({
      entityId: groupChatId,
      notificationType: type,
      userId: recipentId,
      entityName: groupChat.name,
      redirectUrl,
      senderId,
    });

    if (!response) return;

    const sender = await this.usersService.getUserByIdOrLogin(senderId);

    this.server.to(recipentId).emit('notification', {
      ...response,
      sender,
      groupChatName: groupChat.name,
    });
  }

  async handlePostNotification({
    postId,
    senderId,
    type,
    userId,
  }: PostNotificationPayload) {
    const post = await this.postsService.getPostById(postId);
    if (!post) return;

    if (post.authorId === senderId) return;

    let redirectUrl = '';

    switch (type) {
      case 'POST_LIKE':
        redirectUrl = `/profile/${post.authorId}?featuredPostId=${postId}`;
        break;
      case 'POST_COMMENT':
        redirectUrl = `/profile/${post.authorId}?featuredPostId=${postId}`;
        break;
      case 'POST_SHARE':
        redirectUrl = `/profile/${post.authorId}?featuredPostId=${postId}`;
        break;
      default:
        redirectUrl = `/`;
    }

    const response = await this.notificationService.createNotification({
      entityId: postId,
      notificationType: type,
      userId,
      redirectUrl,
      senderId,
    });

    if (!response) return;

    const sender = await this.usersService.getUserByIdOrLogin(senderId);

    this.server.to(post.authorId).emit('notification', { ...response, sender });
  }

  async handleCommentNotification({
    commentId,
    senderId,
    type,
    userId,
  }: CommentNotificationPayload) {
    const comment = await this.commentsService.getComment(commentId);
    if (!comment) return;

    if (comment.authorId === senderId) return;

    const user = await this.prismaService.user.findFirst({
      where: {
        posts: {
          some: {
            id: comment.postId,
          },
        },
      },
    });

    const sender = await this.usersService.getUserByIdOrLogin(senderId);

    let redirectUrl = '';
    switch (type) {
      case 'COMMENT_LIKE':
        redirectUrl = `/profile/${user.id}?featuredPostId=${comment.postId}&commentId=${commentId}`;
        break;
      case 'COMMENT_RESPONSE':
        redirectUrl = `/profile/${user.id}?featuredPostId=${comment.postId}&commentId=${commentId}`;
        break;
      default:
        redirectUrl = `/`;
    }

    const response = await this.notificationService.createNotification({
      entityId: commentId,
      notificationType: type,
      userId,
      redirectUrl,
      senderId,
    });

    if (!response) return;

    this.server.to(comment.authorId).emit('notification', {
      ...response,
      sender,
    });
  }

  @SubscribeMessage('comment-post')
  @UseGuards(WebSocketAuthenticationGuard)
  async handlePostComment(
    @SocketClientId() userId: string,
    @MessageBody(new ZodValidationPipe(notificationCreateSchema))
    data: NotificationDto,
  ) {
    this.handlePostNotification({
      senderId: userId,
      postId: data.entityId,
      userId: data.userId,
      type: 'POST_COMMENT',
    });
  }

  @SubscribeMessage('send-message')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleNewMessage(
    @SocketClientId() userId: string,
    @MessageBody(new ZodValidationPipe(createMessageSchema))
    data: CreateMessageDto,
  ) {
    this.handleMessageNotification({
      senderId: userId,
      groupChatId: data.groupChatId,
      type: 'NEW_MESSAGE',
    });
  }

  @SubscribeMessage('groupchat-add')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleAddedToGroupChat(
    @SocketClientId() userId: string,
    @MessageBody(new ZodValidationPipe(notificationCreateSchema))
    data: NotificationDto,
  ) {
    this.handleGroupchatMembership({
      senderId: userId,
      recipentId: data.userId,
      groupChatId: data.entityId,
      type: 'GROUPCHAT_ADDED',
    });
  }

  @SubscribeMessage('groupchat-remove')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleRemovedFromGroupChat(
    @SocketClientId() userId: string,
    @MessageBody(new ZodValidationPipe(notificationCreateSchema))
    data: NotificationDto,
  ) {
    this.handleGroupchatMembership({
      senderId: userId,
      recipentId: data.userId,
      groupChatId: data.entityId,
      type: 'GROUPCHAT_REMOVED',
    });
  }

  @SubscribeMessage('like-post')
  @UseGuards(WebSocketAuthenticationGuard)
  async handlePostLike(
    @SocketClientId() userId: string,
    @MessageBody(new ZodValidationPipe(notificationCreateSchema))
    data: NotificationDto,
  ) {
    this.handlePostNotification({
      senderId: userId,
      postId: data.entityId,
      userId: data.userId,
      type: 'POST_LIKE',
    });
  }

  @SubscribeMessage('share-post')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleSharePost(
    @SocketClientId() userId: string,
    @MessageBody(new ZodValidationPipe(notificationCreateSchema))
    data: NotificationDto,
  ) {
    this.handlePostNotification({
      senderId: userId,
      postId: data.entityId,
      userId: data.userId,
      type: 'POST_SHARE',
    });
  }

  @SubscribeMessage('like-comment')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleLikeComment(
    @SocketClientId() userId: string,
    @MessageBody(new ZodValidationPipe(notificationCreateSchema))
    data: NotificationDto,
  ) {
    this.handleCommentNotification({
      senderId: userId,
      commentId: data.entityId,
      userId: data.userId,
      type: 'COMMENT_LIKE',
    });
  }

  @SubscribeMessage('respond-comment')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleRespondComment(
    @SocketClientId() userId: string,
    @MessageBody(new ZodValidationPipe(notificationCreateSchema))
    data: NotificationDto,
  ) {
    this.handleCommentNotification({
      senderId: userId,
      commentId: data.entityId,
      userId: data.userId,
      type: 'COMMENT_RESPONSE',
    });
  }

  @SubscribeMessage('invite-friend')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleInviteFriend(
    @SocketClientId() userId: string,
    @MessageBody(new ZodValidationPipe(notificationCreateSchema))
    data: NotificationDto,
  ) {
    this.handleUserNotification({
      senderId: userId,
      userId: data.userId,
      type: 'FRIEND_REQUEST',
    });
  }

  @SubscribeMessage('accept-friend')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleAcceptFriend(
    @SocketClientId() userId: string,
    @MessageBody(new ZodValidationPipe(notificationCreateSchema))
    data: NotificationDto,
  ) {
    this.handleUserNotification({
      senderId: userId,
      userId: data.userId,
      type: 'FRIEND_REQUEST_ACCEPTED',
    });
  }

  @SubscribeMessage('follow-user')
  @UseGuards(WebSocketAuthenticationGuard)
  async handleNewFollower(
    @SocketClientId() userId: string,
    @MessageBody(new ZodValidationPipe(notificationCreateSchema))
    data: NotificationDto,
  ) {
    this.handleUserNotification({
      senderId: userId,
      userId: data.userId,
      type: 'NEW_FOLLOWER',
    });
  }
}
