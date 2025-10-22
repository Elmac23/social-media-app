import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from '../auth/auth.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [AuthModule, PostsModule],
  providers: [SocketGateway],
  controllers: [],
  exports: [],
})
export class SocketModule {}
