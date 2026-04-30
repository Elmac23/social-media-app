import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin';
import { AuthenticationGuard } from 'src/guards/authentication';
import { CommentOrderByKeys } from 'src/modules/comments/comments.schema';

import { CommentsService } from 'src/modules/comments/comments.service';
import { QueryPipe } from 'src/pipes/query.pipe';
import { QueryWithOrderedBy } from 'src/types/query';
@Controller('users/:id/comments')
export class UserCommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  @UseGuards(AuthenticationGuard, AdminGuard)
  async getComments(
    @Param('id') userId: string,
    @Query(new QueryPipe(CommentOrderByKeys))
    query: QueryWithOrderedBy<CommentOrderByKeys>,
  ) {
    return await this.commentsService.getUserComments(userId, query);
  }
}
