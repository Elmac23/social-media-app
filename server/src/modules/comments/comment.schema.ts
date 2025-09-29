import z from 'zod';

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(500, 'Content is too long'),
  postId: z.string(),
  parentCommentId: z.string().optional(),
});

export type CommentDto = z.infer<typeof commentSchema> & { authorId?: string };

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(500, 'Content is too long')
    .optional(),
});

export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;
