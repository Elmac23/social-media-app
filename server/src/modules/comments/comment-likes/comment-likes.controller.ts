import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentLikesService } from './comment-likes.service';
import { UserId } from 'src/decorators/user-id';
import { AuthenticationGuard } from 'src/guards/authentication';
import { PostLikesOrderByKeys } from 'src/modules/posts/post-likes/post-likes.schema';
import { QueryWithOrderedBy } from 'src/types/query';
import {
  commentLikeOrderByKeys,
  CommentLikesOrderByKeys,
} from './comment-likes.schema';
import { QueryPipe } from 'src/pipes/query.pipe';

@Controller('comments/:id/likes')
export class CommentLikesController {
  constructor(private commentLikesService: CommentLikesService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async getLikes(
    @Param('id') commentId: string,
    @Query(new QueryPipe(commentLikeOrderByKeys))
    query: QueryWithOrderedBy<CommentLikesOrderByKeys>,
  ) {
    return await this.commentLikesService.getLikes(commentId, query);
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  async likeComment(@Param('id') commentId: string, @UserId() userId: string) {
    return await this.commentLikesService.likeComment(commentId, userId);
  }

  @Delete()
  @UseGuards(AuthenticationGuard)
  async unlikeComment(
    @Param('id') commentId: string,
    @UserId() userId: string,
  ) {
    return await this.commentLikesService.unlikeComment(commentId, userId);
  }
}
