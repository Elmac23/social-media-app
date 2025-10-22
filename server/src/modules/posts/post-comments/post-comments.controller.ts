import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PostCommentsService } from './post-comments.service';
import { UserId } from 'src/decorators/user-id';
import { AuthenticationGuard } from 'src/guards/authentication';

@Controller('posts/:postId/comments')
export class PostCommentsController {
  constructor(private postCommentsService: PostCommentsService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async getComments(@Param('postId') postId: string, @UserId() userId: string) {
    return this.postCommentsService.getCommentsByPost(postId, userId);
  }
}
