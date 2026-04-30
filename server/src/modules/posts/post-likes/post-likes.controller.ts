import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostLikesService } from './post-likes.service';
import { AuthenticationGuard } from 'src/guards/authentication';
import { UserId } from 'src/decorators/user-id';
import { QueryWithOrderedBy } from 'src/types/query';
import {
  postLikesOrderByKeys,
  PostLikesOrderByKeys,
} from './post-likes.schema';
import { QueryPipe } from 'src/pipes/query.pipe';

@Controller('posts/:postId/likes')
export class PostLikesController {
  constructor(private postLikesService: PostLikesService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async getLikes(
    @Param('postId') postId: string,
    @Query(new QueryPipe(postLikesOrderByKeys))
    query: QueryWithOrderedBy<PostLikesOrderByKeys>,
  ) {
    return await this.postLikesService.getLikes(postId, query);
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  async likePost(@Param('postId') postId: string, @UserId() userId: string) {
    return await this.postLikesService.likePost(postId, userId);
  }

  @Delete()
  @UseGuards(AuthenticationGuard)
  async unlikePost(@Param('postId') postId: string, @UserId() userId: string) {
    return await this.postLikesService.unlikePost(postId, userId);
  }
}
