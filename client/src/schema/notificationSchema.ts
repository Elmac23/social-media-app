import z from "zod";

export const notificationCreateSchema = z.object({
  userId: z.string(),
  senderId: z.string(),
  entityId: z.string(),
});
export type NotificationDto = z.infer<typeof notificationCreateSchema>;
