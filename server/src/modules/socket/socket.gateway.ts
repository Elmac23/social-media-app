import { Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { PostsService } from '../posts/posts.service';
import { SocketClientId } from 'src/decorators/socket-client-id';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
@WebSocketGateway(81, { cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection {
  constructor(
    private authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  @WebSocketServer()
  server: Socket;

  async handleConnection(@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth.token;

    if (!token) {
      client.emit('unauthorized', 'No token provided');
      client.disconnect();
      return;
    }

    const payload = await this.authService.verifyToken(token);
    if (!payload) {
      client.emit('unauthorized', 'Invalid token');
      client.disconnect();
      return;
    }

    client.handshake.auth.userId = payload.id;

    client.join(payload.id);
  }
}
