import { PrivacyOptions, User } from "./user";

export type Post = {
  id: string;
  author: User;
  content: string;
  fileId?: string;
  likesCount: number;
  commentsCount: number;
  sharedPostsCount: number;
  privacy: PrivacyOptions;
  createdAt: string;
  isLikedByMe?: boolean;
  isSharedByMe?: boolean;
  updatedAt?: string;
};

export type PostAction = {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
  user: Pick<User, "avatarUrl" | "name" | "login" | "lastname" | "id">;
};
