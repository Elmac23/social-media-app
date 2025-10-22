import { UpdateUser, User, UserProfile } from "@/types/user";
import { api } from ".";
import { Query } from "@/types/query";
import { withQuery } from "@/lib/withQuery";

export const getUsers = (query: Query) => {
  return api.get<User[]>(withQuery("/users", query));
};

export const updateUser = (
  id: string,
  data: UpdateUser | FormData,
  token: string
) => {
  return api.patch(`/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUserProfileById = (id: string, token: string) => {
  return api.get<UserProfile>(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
