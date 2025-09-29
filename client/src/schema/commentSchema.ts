import z from "zod";

export const commentSchema = z.object({
  content: z.string().min(1, "Content is required"),
});
export type CreateComment = z.infer<typeof commentSchema>;
export type UpdateComment = Partial<CreateComment>;
