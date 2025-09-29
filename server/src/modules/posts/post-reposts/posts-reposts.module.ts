import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { PostRepostsController } from './posts-reposts.controller';
import { PostRepostsService } from './posts-reposts.service';

@Module({
  imports: [PrismaModule],
  providers: [PostRepostsService],
  controllers: [PostRepostsController],
})
export class PostRepostsModule {}
