import { Controller, Get, UseGuards } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { AuthenticationGuard } from 'src/guards/authentication';
import { SelfOrAdminGuard } from 'src/guards/self-or-admin';
import { UserId } from 'src/decorators/user-id';

@Controller('users/:id/invites')
export class UserInvitesController {
  constructor(private invitesService: InvitesService) {}

  @Get()
  @UseGuards(AuthenticationGuard, SelfOrAdminGuard)
  async getInvites(@UserId() userId: string) {
    return await this.invitesService.getUserInvites(userId);
  }

  @Get('received')
  @UseGuards(AuthenticationGuard, SelfOrAdminGuard)
  async getReceivedInvites(@UserId() userId: string) {
    const { receivedInvites } =
      await this.invitesService.getUserInvites(userId);

    return receivedInvites;
  }

  @Get('sent')
  @UseGuards(AuthenticationGuard, SelfOrAdminGuard)
  async getSentInvites(@UserId() userId: string) {
    const { sentInvites } = await this.invitesService.getUserInvites(userId);

    return sentInvites;
  }
}
