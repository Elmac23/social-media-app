import { Prisma } from 'generated/prisma';
import z from 'zod';

export const notificationCreateSchema = z.object({
  userId: z.string(),
  entityId: z.string(),
});

export type NotificationDto = z.infer<typeof notificationCreateSchema>;

export type NotificationCreate = NotificationDto & {
  senderId: string;
  notificationType: NotificationType;
  redirectUrl?: string;
  count?: number;
};

export type NotificationType =
  | 'FRIEND_REQUEST'
  | 'FRIEND_REQUEST_ACCEPTED'
  | 'NEW_FOLLOWER'
  | 'POST_LIKE'
  | 'POST_COMMENT'
  | 'COMMENT_LIKE'
  | 'COMMENT_RESPONSE'
  | 'POST_SHARE';
