import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PostCommentsService } from './post-comments.service';
import { UserId } from 'src/decorators/user-id';
import { AuthenticationGuard } from 'src/guards/authentication';
import { CommentOrderByKeys } from 'src/modules/comments/comments.schema';
import { QueryPipe } from 'src/pipes/query.pipe';
import { QueryWithOrderedBy } from 'src/types/query';

@Controller('posts/:postId/comments')
export class PostCommentsController {
  constructor(private postCommentsService: PostCommentsService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async getComments(
    @Param('postId') postId: string,
    @UserId() userId: string,
    @Query(new QueryPipe(CommentOrderByKeys))
    query: QueryWithOrderedBy<CommentOrderByKeys>,
  ) {
    return this.postCommentsService.getCommentsByPost(postId, userId, query);
  }
}
