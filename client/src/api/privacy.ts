import { UserPrivacy, UserPrivacyPartial } from "@/types/user";
import { api } from ".";
import extractDataFromAxios from "@/lib/extractDataFromAxios";
import withToken from "@/lib/withToken";

export const updatePrivacy = (
  id: string,
  data: UserPrivacyPartial,
  accessToken?: string,
) => {
  const fn = api.patch(`/users/${id}/privacy`, data, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const getPrivacy = (id: string, accessToken?: string) => {
  const fn = api.get<UserPrivacy>(
    `/users/${id}/privacy`,
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};
