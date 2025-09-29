import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/guards/authentication';
import { UserId } from 'src/decorators/user-id';
import { PostRepostsService } from './posts-reposts.service';
import { ForbidSelfRepostGuard } from 'src/guards/forbid-self-repost';

@Controller('posts/:postId/reposts')
export class PostRepostsController {
  constructor(private postRepostsService: PostRepostsService) {}

  @Post()
  @UseGuards(AuthenticationGuard, ForbidSelfRepostGuard)
  async addRepost(@Param('postId') postId: string, @UserId() userId: string) {
    return await this.postRepostsService.addRepost(postId, userId);
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
