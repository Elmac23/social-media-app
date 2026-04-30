import { api } from ".";
import { User } from "@/types/user";
import extractDataFromAxios from "@/lib/extractDataFromAxios";
import { WithCount } from "@/types/withCount";
import withToken from "@/lib/withToken";
import { withQuery } from "@/lib/withQuery";
import { Query } from "@/types/query";

type FollowData = {
  followers: WithCount<User>;
  following: WithCount<User>;
};

export const getFollowers = (
  id: string,
  query: Query,
  accessToken?: string,
) => {
  const fn = api.get<FollowData>(
    withQuery(`/users/${id}/followers`, query),

    withToken(accessToken),
  );

  console.log(withQuery("", query));
  return extractDataFromAxios(fn);
};

export const follow = (id: string, accessToken?: string) => {
  const fn = api.post(`/users/${id}/followers`, {}, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const unfollow = (id: string, accessToken?: string) => {
  const fn = api.delete(`/users/${id}/followers`, withToken(accessToken));
  return extractDataFromAxios(fn);
};
