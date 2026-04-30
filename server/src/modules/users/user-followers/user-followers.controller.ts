import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/guards/authentication';

import { UserId } from 'src/decorators/user-id';
import { UserFollowersService } from './user-followers.service';
import { QueryWithOrderedBy } from 'src/types/query';
import { userOrderByKeys, UserOrderByKeys } from '../user.schema';
import { QueryPipe } from 'src/pipes/query.pipe';
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
  async getFollowers(
    @Param('id') userId: string,
    @Query(new QueryPipe(userOrderByKeys))
    query: QueryWithOrderedBy<UserOrderByKeys>,
  ) {
    return await this.userFollowersService.getFollowers(userId, query);
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
