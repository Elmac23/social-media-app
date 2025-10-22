import { UserPrivacy, UserPrivacyPartial } from "@/types/user";
import { api } from ".";

export const updatePrivacy = (
  id: string,
  data: UserPrivacyPartial,
  token: string
) => {
  return api.patch(`/users/${id}/privacy`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getPrivacy = (id: string, token: string) => {
  return api.get<UserPrivacy>(`/users/${id}/privacy`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
