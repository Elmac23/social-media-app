import { UpdateComment } from "@/schema/commentSchema";
import { api } from ".";
import type { Comment } from "@/types/comment";
import { Query } from "@/types/query";
import { withQuery } from "@/lib/withQuery";
import extractDataFromAxios from "@/lib/extractDataFromAxios";
import { WithCount } from "@/types/withCount";
import withToken from "@/lib/withToken";

export const getComments = (query: Query, accessToken?: string) => {
  const fn = api.get<WithCount<Comment>>(
    withQuery("/comments", query),
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};

export const likeComment = (commentId: string, accessToken?: string) => {
  const fn = api.post(
    `/comments/${commentId}/likes`,
    {},
    withToken(accessToken),
  );

  return extractDataFromAxios(fn);
};

export const unlikeComment = (commentId: string, accessToken?: string) => {
  const fn = api.delete(`/comments/${commentId}/likes`, withToken(accessToken));
  return extractDataFromAxios(fn);
};

type CreateCommentDto = {
  content: string;
  parentCommentId?: string;
  postId: string;
};

export const createComment = (data: CreateCommentDto, accessToken?: string) => {
  const fn = api.post(
    `/comments`,
    {
      ...data,
    },
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};

export const deleteComment = (commentId: string, accessToken?: string) => {
  const fn = api.delete(`/comments/${commentId}`, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const updateComment = (
  commentId: string,
  data: UpdateComment,
  accessToken?: string,
) => {
  const fn = api.patch(
    `/comments/${commentId}`,
    {
      ...data,
    },
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};

export const getPostComments = (postId: string, accessToken?: string) => {
  const fn = api.get<WithCount<Comment>>(
    `/posts/${postId}/comments`,
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};

export const getCommentsByParentId = (
  parentCommentId: string,
  accessToken?: string,
) => {
  const fn = api.get<WithCount<Comment>>(
    `/comments/${parentCommentId}/children`,
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};
