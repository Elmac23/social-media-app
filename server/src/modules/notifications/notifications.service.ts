import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationCreate } from './notification.schema';

@Injectable()
export class NotificationsService {
  constructor(private prismaService: PrismaService) {}

  async getUserNotifications(userId: string) {
    return this.prismaService.notification.findMany({
      where: { userId },
      include: { sender: { omit: { hashedPassword: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteNotification(userId: string, id: string) {
    return this.prismaService.notification.deleteMany({
      where: { id, userId },
    });
  }

  async createNotification(data: NotificationCreate) {
    const { userId, notificationType, entityId, senderId } = data;
    const notification = await this.prismaService.notification.findUnique({
      where: {
        userId_notificationType_entityId_senderId: {
          senderId,
          entityId,
          notificationType,
          userId,
        },
      },
    });

    if (!notification) {
      return this.prismaService.notification.create({
        data,
      });
    }
  }
}
