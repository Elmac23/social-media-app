import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthenticationGuard } from 'src/guards/authentication';
import { UserId } from 'src/decorators/user-id';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async getNotifications(@UserId() userId: string) {
    return this.notificationsService.getUserNotifications(userId);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  async deleteNotification(@UserId() userId: string, id: string) {
    return this.notificationsService.deleteNotification(userId, id);
  }
}
