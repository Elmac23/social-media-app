import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostLikesService } from './post-likes.service';
import { AuthenticationGuard } from 'src/guards/authentication';
import { UserId } from 'src/decorators/user-id';

@Controller('posts/:postId/likes')
export class PostLikesController {
  constructor(private postLikesService: PostLikesService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async getLikes(@Param('postId') postId: string) {
    return await this.postLikesService.getLikes(postId);
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
