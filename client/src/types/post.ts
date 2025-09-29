import { User } from "./user";

export type Post = {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLikedByMe?: boolean;
  isSharedByMe?: boolean;
  updatedAt?: string;
};
