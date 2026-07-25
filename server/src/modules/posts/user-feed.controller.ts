import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { UserId } from 'src/decorators/user-id';
import { AuthenticationGuard } from 'src/guards/authentication';
import { PostPrivacyInterceptor } from 'src/interceptors/post-privacy';

@Controller('users/:id/feed')
export class UserFeedController {
  constructor(private postsService: PostsService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(PostPrivacyInterceptor)
  async getUserFeed(@Param('id') id: string, @UserId() userId: string) {
    return await this.postsService.getUserProfilePosts(id, userId);
  }
}
