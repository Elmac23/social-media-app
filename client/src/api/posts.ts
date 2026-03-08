import { Post } from "@/types/post";
import { api } from ".";
import { UpdatePost } from "@/schema/postSchema";
import { Query } from "@/types/query";
import { withQuery } from "@/lib/withQuery";
import extractDataFromAxios from "@/lib/extractDataFromAxios";
import { WithCount } from "@/types/withCount";
import withToken from "@/lib/withToken";

export const getPosts = (query: Query, accessToken?: string) => {
  const fn = api.get<WithCount<Post>>(
    withQuery("/posts", query),
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};

export const getUsersPosts = (userId: string, accessToken?: string) => {
  const fn = api.get<WithCount<Post>>(
    `/users/${userId}/posts`,
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};

export const getUsersFeed = (userId: string, accessToken?: string) => {
  const fn = api.get<WithCount<Post>>(
    `/users/${userId}/feed`,
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};

export const getPostById = (postId: string, accessToken?: string) => {
  const fn = api.get<Post>("/posts/" + postId, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const updatePost = (
  id: string,
  data: UpdatePost,
  accessToken?: string,
) => {
  const fn = api.patch(`/posts/${id}`, data, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const createPost = (data: FormData, accessToken?: string) => {
  const fn = api.post("/posts", data, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  return extractDataFromAxios(fn);
};

export const deletePost = (id: string, accessToken?: string) => {
  const fn = api.delete(`/posts/${id}`, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const likePost = (id: string, accessToken?: string) => {
  const fn = api.post(`/posts/${id}/likes`, {}, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const unlikePost = (id: string, accessToken?: string) => {
  const fn = api.delete(`/posts/${id}/likes`, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const addRepost = (id: string, accessToken?: string) => {
  const fn = api.post(`/posts/${id}/reposts`, {}, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const deleteRepost = (id: string, accessToken?: string) => {
  const fn = api.delete(`/posts/${id}/reposts`, withToken(accessToken));
  return extractDataFromAxios(fn);
};
