import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { FriendsModule } from './modules/users/friends/friends.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { InvitesModule } from './modules/invites/invites.module';
import { PostLikesModule } from './modules/posts/post-likes/post-likes.module';
import { PostCommentsModule } from './modules/posts/post-comments/post-comments.module';
import { CommentLikesModule } from './modules/comments/comment-likes/comment-likes.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { diskStorage } from 'multer';
import { PostRepostsModule } from './modules/posts/post-reposts/posts-reposts.module';
import { UserFollowersController } from './modules/users/user-followers/user-followers.controller';
import { UserFollowersModule } from './modules/users/user-followers/user-followers.module';
import { UserPrivacyModule } from './modules/users/user-privacy/user-privacy.module';
import { SocketModule } from './modules/socket/socket.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { GroupChatsModule } from './modules/group-chats/group-chats.module';
import { MessagesModule } from './modules/messages/messages.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { EmailModule } from './modules/email/email.module';
import { FilesController } from './modules/files/files.controller';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    PrismaModule,
    UserPrivacyModule,
    GroupChatsModule,
    MessagesModule,
    NotificationsModule,
    UsersModule,
    FriendsModule,
    SocketModule,
    PostLikesModule,
    PostsModule,
    JwtModule.register({ secret: process.env.JWT_SECRET, global: true }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_SERVER'),
          port: +config.get('MAIL_PORT'),
          secure: false, // true dla portu 465, false dla 587/25
          auth: {
            user: config.get('MAIL_LOGIN'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),

    CommentsModule,
    InvitesModule,
    CommentLikesModule,
    PostRepostsModule,
    PostCommentsModule,
    UserFollowersModule,
    EmailModule,
    FilesModule,
  ],
  controllers: [FilesController],
  providers: [],
})
export class AppModule {}
