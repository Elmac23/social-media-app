import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InvitesService } from './invites.service';
import { AdminGuard } from 'src/guards/admin';
import { AuthenticationGuard } from 'src/guards/authentication';
import { UserId } from 'src/decorators/user-id';
import { FriendRequestDto, friendRequestSchema } from './invites.schema';
import { ZodValidationPipe } from 'src/pipes/ZodValidationPipe';

@Controller('invites')
export class InvitesController {
  constructor(private invitesService: InvitesService) {}

  @Get()
  @UseGuards(AdminGuard)
  async getAllInvites() {
    return await this.invitesService.getAllInvites();
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  async sendInvite(
    @Body(new ZodValidationPipe(friendRequestSchema)) body: FriendRequestDto,
    @UserId() userId: string,
  ) {
    return await this.invitesService.inviteUser({
      recipentId: body.recipentId,
      senderId: userId,
    });
  }

  @Delete(':inviteId')
  @HttpCode(204)
  @UseGuards(AuthenticationGuard)
  async deleteInvite(@Param('inviteId') inviteId: string) {
    return await this.invitesService.deleteInvite(inviteId);
  }

  @Post(':inviteId/accept')
  @UseGuards(AuthenticationGuard)
  async acceptInvite(@Param('inviteId') inviteId: string) {
    return await this.invitesService.acceptInvite(inviteId);
  }
}
