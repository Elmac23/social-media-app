import z from 'zod';

export const createMessageSchema = z.object({
  content: z.string().min(1).max(1000),
  senderId: z.string(),
  groupChatId: z.string(),
  type: z.enum(['DEFAULT', 'SYSTEM_ADD_USER', 'SYSTEM_REMOVE_USER']).optional(),
});
export type CreateMessageDto = z.infer<typeof createMessageSchema>;

export const messageOrderByKeys = [
  'id',
  'createdAt',
  'author',
  'groupChatId',
  'content',
] as const;

export type MessageOrderByKeys = (typeof messageOrderByKeys)[number];
