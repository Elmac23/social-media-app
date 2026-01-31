import { NotificationType, Prisma } from 'generated/prisma';
import z from 'zod';

export const notificationCreateSchema = z.object({
  userId: z.string(),
  entityId: z.string(),
  entityName: z.string().optional(),
});

export type NotificationDto = z.infer<typeof notificationCreateSchema>;

export type NotificationCreate = NotificationDto & {
  senderId: string;
  notificationType: NotificationType;
  redirectUrl?: string;
  count?: number;
};
