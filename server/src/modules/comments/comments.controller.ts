import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthenticationGuard } from 'src/guards/authentication';
import {
  CommentDto,
  commentSchema,
  UpdateCommentDto,
  updateCommentSchema,
} from './comments.schema';
import { UserId } from 'src/decorators/user-id';
import { ZodValidationPipe } from 'src/pipes/ZodValidationPipe';
import { CommentAuthorGuard } from 'src/guards/comment-author';
import { AdminGuard } from 'src/guards/admin';
import { QueryPipe } from 'src/pipes/query.pipe';
import { QueryType, QueryWithOrderedBy } from 'src/types/query';
import { CommentOrderByKeys } from './comments.schema';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}
  @Get()
  @UseGuards(AuthenticationGuard, AdminGuard)
  async getComments(
    @Query(new QueryPipe(CommentOrderByKeys))
    query: QueryWithOrderedBy<CommentOrderByKeys>,
  ) {
    return await this.commentsService.getComments(query);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthenticationGuard, CommentAuthorGuard)
  async deleteComment(@Param('id') id: string) {
    return await this.commentsService.deleteComment(id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, CommentAuthorGuard)
  async updateComment(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCommentSchema)) body: UpdateCommentDto,
  ) {
    return await this.commentsService.updateComment(id, body);
  }

  @Get(':id')
  async getComment(@Param('id') id: string, @UserId() userId: string) {
    return await this.commentsService.getCommentAsUser(id, userId);
  }

  @Get(':id/children')
  @UseGuards(AuthenticationGuard)
  async getSubComments(@Param('id') id: string, @UserId() userId: string) {
    return await this.commentsService.getCommentsByParentComment(id, userId);
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  async createComment(
    @Body(new ZodValidationPipe(commentSchema)) body: CommentDto,
    @UserId() userId: string,
  ) {
    body.authorId = userId;
    return await this.commentsService.createComment(body);
  }
}
