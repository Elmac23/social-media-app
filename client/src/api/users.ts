import { UpdateUser, UserProfile } from "@/types/user";
import { api } from ".";

export const getUsers = () => {
  return api.get("/users");
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
