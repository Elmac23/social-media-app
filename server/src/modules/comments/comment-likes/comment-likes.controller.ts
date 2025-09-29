import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentLikesService } from './comment-likes.service';
import { UserId } from 'src/decorators/user-id';
import { AuthenticationGuard } from 'src/guards/authentication';

@Controller('comments/:id/likes')
export class CommentLikesController {
  constructor(private commentLikesService: CommentLikesService) {}

  @Get()
  async getLikes(@Param('id') id: string) {
    return await this.commentLikesService.getLikes(id);
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
