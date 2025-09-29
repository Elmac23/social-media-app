import { Module } from '@nestjs/common';
import { PostCommentsController } from './post-comments.controller';
import { PostCommentsService } from './post-comments.service';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PostCommentsController],
  providers: [PostCommentsService],
})
export class PostCommentsModule {}
