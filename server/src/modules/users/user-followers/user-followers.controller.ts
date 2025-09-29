import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/guards/authentication';

import { UserId } from 'src/decorators/user-id';
import { UserFollowersService } from './user-followers.service';
@Controller('users/:id/followers')
export class UserFollowersController {
  constructor(private userFollowersService: UserFollowersService) {}
  @Post()
  @UseGuards(AuthenticationGuard)
  @HttpCode(201)
  async followUser(
    @UserId() followerId: string,
    @Param('id') followedId: string,
  ) {
    return await this.userFollowersService.follow(followerId, followedId);
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  async getFollowers(@Param('id') userId: string) {
    return await this.userFollowersService.getFollowers(userId);
  }

  @Delete()
  @UseGuards(AuthenticationGuard)
  @HttpCode(204)
  async unfollowUser(
    @UserId() followerId: string,
    @Param('id') followedId: string,
  ) {
    return await this.userFollowersService.unfollow(followerId, followedId);
  }
}
