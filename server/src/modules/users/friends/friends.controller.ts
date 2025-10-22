import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AuthenticationGuard } from 'src/guards/authentication';
import { ZodValidationPipe } from 'src/pipes/ZodValidationPipe';
import { UserId } from 'src/decorators/user-id';
import { SelfOrAdminGuard } from 'src/guards/self-or-admin';

@Controller('users/:id/friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async getFriends(@Param('id') userId: string) {
    return await this.friendsService.getFriends(userId);
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
