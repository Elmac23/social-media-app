import { Controller, Get, Param } from '@nestjs/common';
import { PostCommentsService } from './post-comments.service';

@Controller('posts/:postId/comments')
export class PostCommentsController {
  constructor(private postCommentsService: PostCommentsService) {}

  @Get()
  async getComments(@Param('postId') postId: string) {
    return this.postCommentsService.getCommentsByPost(postId);
  }
}
