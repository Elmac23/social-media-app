import z from 'zod';

export const fileSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  postId: z.string().optional(),
  privacy: z.enum(['PRIVATE', 'PUBLIC', 'FRIENDS']),
  mimeType: z.string(),
});

export type FileDto = z.infer<typeof fileSchema>;
