import z from 'zod';

export const postSchema = z.object({
  content: z.string().min(1, 'Content is required'),
});
export type PostDto = z.infer<typeof postSchema>;

export const updatePostSchema = z.object({
  content: z.string().min(1, 'Content is required').optional(),
});

export const postOrderByKeys = [
  'id',
  'createdAt',
  'author',
  'content',
  'likes',
  'responses',
  'reposts',
] as const;

export type PostOrderByKeys = (typeof postOrderByKeys)[number];

export type UpdatePostDto = z.infer<typeof updatePostSchema>;
