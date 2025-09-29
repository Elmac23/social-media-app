import { UpdateComment } from "@/schema/commentSchema";
import { api } from ".";
import type { Comment } from "@/types/comment";

export const getComments = () => {
  return api.get<Comment[]>("/comments");
};

export const likeComment = (commentId: string, token: string) => {
  return api.post(
    `/comments/${commentId}/likes`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const unlikeComment = (commentId: string, token: string) => {
  return api.delete(`/comments/${commentId}/likes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

type CreateCommentDto = {
  content: string;
  parentCommentId?: string;
  postId: string;
};

export const createComment = (data: CreateCommentDto, token: string) => {
  return api.post(
    `/comments`,
    {
      ...data,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const deleteComment = (commentId: string, token: string) => {
  return api.delete(`/comments/${commentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateComment = (
  commentId: string,
  data: UpdateComment,
  token: string
) => {
  return api.patch(
    `/comments/${commentId}`,
    {
      ...data,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getPostComments = (postId: string) => {
  return api.get<Comment[]>(`/posts/${postId}/comments`);
};

export const getCommentsByParentId = (parentCommentId: string) => {
  return api.get<Comment[]>(`/comments/${parentCommentId}/children`);
};
