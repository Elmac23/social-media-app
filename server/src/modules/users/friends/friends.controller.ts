import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AuthenticationGuard } from 'src/guards/authentication';
import { ZodValidationPipe } from 'src/pipes/ZodValidationPipe';
import { UserId } from 'src/decorators/user-id';
import { SelfOrAdminGuard } from 'src/guards/self-or-admin';
import { QueryPipe } from 'src/pipes/query.pipe';
import { QueryType } from 'src/types/query';

@Controller('users/:id/friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async getFriends(
    @Param('id') userId: string,
    @Query(new QueryPipe()) query: QueryType,
  ) {
    return await this.friendsService.getFriends(userId, query);
  }

  @Delete(':friendId')
  @HttpCode(204)
  @UseGuards(AuthenticationGuard, SelfOrAdminGuard)
  async deleteFriend(
    @UserId() userId: string,
    @Param('friendId') friendId: string,
  ) {
    return await this.friendsService.deleteFriend(userId, friendId);
  }
}
