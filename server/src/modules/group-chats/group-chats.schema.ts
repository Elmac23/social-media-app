import z from 'zod';

export const createGroupChatSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().optional(),
  description: z.string().max(255).optional(),
  memberIds: z.array(z.string()).min(2),
  type: z.enum(['DIRECT', 'GROUP']),
});
export type CreateGroupChatDto = z.infer<typeof createGroupChatSchema>;
