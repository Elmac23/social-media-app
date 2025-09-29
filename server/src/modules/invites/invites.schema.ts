import z from 'zod';

export const friendRequestSchema = z.object({
  recipentId: z.string(),
});
export type FriendRequestDto = z.infer<typeof friendRequestSchema>;
