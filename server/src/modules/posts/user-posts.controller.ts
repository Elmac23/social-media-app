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

@Controller('users/:id/posts')
export class UserPostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(PostPrivacyInterceptor)
  async getUserPosts(@Param('id') id: string, @UserId() userId: string) {
    return await this.postsService.getUserPosts(id, userId);
  }
}
