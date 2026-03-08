import { UpdateUser, User, UserProfile } from "@/types/user";
import { api } from ".";
import { Query } from "@/types/query";
import { withQuery } from "@/lib/withQuery";
import extractDataFromAxios from "@/lib/extractDataFromAxios";
import { WithCount } from "@/types/withCount";
import withToken from "@/lib/withToken";

export const getUsers = (query: Query, accessToken?: string) => {
  console.log(query.orderBy);
  console.log(withQuery("/users", query));
  const fn = api.get<WithCount<User>>(
    withQuery("/users", query),
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};

export const updateUser = (
  id: string,
  data: UpdateUser | FormData,
  accessToken?: string,
) => {
  const fn = api.patch(`/users/${id}`, data, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const getUserProfileById = (id: string, accessToken?: string) => {
  const fn = api.get<UserProfile>(`/users/${id}`, withToken(accessToken));
  return extractDataFromAxios(fn);
};
