import { User } from "./user";

export type Comment = {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  parentCommentId?: string;
  postId: string;
  author: User;
  likesCount: number;
  subCommentsCount: number;
  isLikedByMe?: boolean;
};
