import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/guards/authentication';
import { UserId } from 'src/decorators/user-id';
import { PostRepostsService } from './posts-reposts.service';
import { ForbidSelfRepostGuard } from 'src/guards/forbid-self-repost';
import { QueryWithOrderedBy } from 'src/types/query';
import {
  postRepostsOrderByKeys,
  PostRepostsOrderByKeys,
} from './post-reposts.schema';
import { QueryPipe } from 'src/pipes/query.pipe';

@Controller('posts/:postId/reposts')
export class PostRepostsController {
  constructor(private postRepostsService: PostRepostsService) {}

  @Post()
  @UseGuards(AuthenticationGuard, ForbidSelfRepostGuard)
  async addRepost(@Param('postId') postId: string, @UserId() userId: string) {
    return await this.postRepostsService.addRepost(postId, userId);
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  async getReposts(
    @Param('postId') postId: string,
    @Query(new QueryPipe(postRepostsOrderByKeys))
    query: QueryWithOrderedBy<PostRepostsOrderByKeys>,
  ) {
    return await this.postRepostsService.getReposts(postId, query);
  }

  @Delete()
  @UseGuards(AuthenticationGuard)
  async deleteRepost(
    @Param('postId') postId: string,
    @UserId() userId: string,
  ) {
    return await this.postRepostsService.deleteRepost(postId, userId);
  }
}
