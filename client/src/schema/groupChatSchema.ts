import z from "zod";

export const groupChatSchema = z.object({
  name: z.string().max(100).optional(),
  description: z.string().max(255).optional(),
});

export type CreateGroupChatDto = z.infer<typeof groupChatSchema>;
