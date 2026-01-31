import z from 'zod';

export const createGroupChatSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(255).optional(),
  memberIds: z.array(z.string()).min(2),
  type: z.enum(['DIRECT', 'GROUP']),
});
export type CreateGroupChatDto = z.infer<typeof createGroupChatSchema>;

export const updateGroupChatSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(255),
});

export type UpdateGroupChatDto = z.infer<typeof updateGroupChatSchema>;
