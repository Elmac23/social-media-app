import { api } from ".";
import { User } from "@/types/user";

type FollowData = {
  followers: User[];
  following: User[];
};

export const getFollowers = (id: string, token: string) => {
  return api.get<FollowData>(`/users/${id}/followers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const follow = (id: string, token: string) => {
  return api.post(
    `/users/${id}/followers`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const unfollow = (id: string, token: string) => {
  return api.delete(`/users/${id}/followers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
