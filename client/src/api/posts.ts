import { Post } from "@/types/post";
import { api } from ".";
import { UpdatePost } from "@/schema/postSchema";

export const getPosts = () => {
  return api.get<Post[]>("/posts");
};

export const getUsersPosts = (userId: string, token: string) => {
  console.log("Fetching posts for user:", userId);
  return api.get<Post[]>(`/users/${userId}/posts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUsersFeed = (userId: string, token: string) => {
  console.log("Fetching posts for user:", userId);
  return api.get<Post[]>(`/users/${userId}/feed`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getPostById = (postId: string) => {
  return api.get<Post>("/posts/" + postId);
};

export const updatePost = (id: string, data: UpdatePost, token: string) => {
  return api.patch(`/posts/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createPost = (data: FormData, token: string) => {
  console.log("Creating post with data:", data);
  return api.post("/posts", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deletePost = (id: string, token: string) => {
  return api.delete(`/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const likePost = (id: string, token: string) => {
  return api.post(
    `/posts/${id}/likes`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const unlikePost = (id: string, token: string) => {
  return api.delete(`/posts/${id}/likes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addRepost = (id: string, token: string) => {
  return api.post(
    `/posts/${id}/reposts`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const deleteRepost = (id: string, token: string) => {
  return api.delete(`/posts/${id}/reposts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
