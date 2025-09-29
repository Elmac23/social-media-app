import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { FriendsModule } from './modules/friends/friends.module';
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

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    PrismaModule,
    UsersModule,
    FriendsModule,
    PostLikesModule,
    PostsModule,
    JwtModule.register({ secret: process.env.JWT_SECRET, global: true }),
    CommentsModule,
    InvitesModule,
    CommentLikesModule,
    PostRepostsModule,
    PostCommentsModule,
    UserFollowersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
