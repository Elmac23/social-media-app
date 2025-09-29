import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentLikesService } from './comment-likes/comment-likes.service';
import { CommentLikesModule } from './comment-likes/comment-likes.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
