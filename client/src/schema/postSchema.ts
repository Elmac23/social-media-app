import z from "zod";

export const postSchema = z.object({
  content: z.string().min(1, "Content is required"),
});
export type CreatePost = z.infer<typeof postSchema>;
export type CreatePostWithImage = CreatePost & { image: File };
export type UpdatePost = Partial<CreatePost>;
