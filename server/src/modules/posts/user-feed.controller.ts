import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { UserId } from 'src/decorators/user-id';
import { AuthenticationGuard } from 'src/guards/authentication';

@Controller('users/:id/feed')
export class UserFeedController {
  constructor(private postsService: PostsService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async getUserFeed(@Param('id') id: string, @UserId() userId: string) {
    return await this.postsService.getUserProfilePosts(id, userId);
  }
}
