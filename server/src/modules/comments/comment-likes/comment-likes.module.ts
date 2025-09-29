import { Module } from '@nestjs/common';
import { CommentLikesController } from './comment-likes.controller';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { CommentLikesService } from './comment-likes.service';

@Module({
  imports: [PrismaModule],
  controllers: [CommentLikesController],
  providers: [CommentLikesService],
})
export class CommentLikesModule {}
