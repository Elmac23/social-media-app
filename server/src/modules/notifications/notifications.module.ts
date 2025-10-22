import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { PostsModule } from '../posts/posts.module';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsService } from './notifications.service';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from '../comments/comments.module';
import { NotificationController } from './notification.controller';

@Module({
  imports: [PostsModule, PrismaModule, UsersModule, CommentsModule],
  providers: [NotificationsGateway, NotificationsService],
  controllers: [NotificationController],
  exports: [],
})
export class NotificationsModule {}
