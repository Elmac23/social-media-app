import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CommentsModule } from 'src/modules/comments/comments.module';
import { UserPostsController } from './user-posts.controller';
import { PostCommentsModule } from './post-comments/post-comments.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { UserRepostsPostsController } from './user-reposts.controller';
import { UserFeedController } from './user-feed.controller';

@Module({
  imports: [
    CommentsModule,
    PostCommentsModule,
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../../public/posts'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const originalName = file.originalname.replace(/\s+/g, '-');
          cb(null, uniqueSuffix + '-' + originalName);
        },
      }),
    }),
  ],
  controllers: [
    PostsController,
    UserPostsController,
    UserRepostsPostsController,
    UserFeedController,
  ],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
