import { ReceivedFriendIvite, SentFriendInvite } from "@/types/friendRequest";
import { api } from ".";
import { User } from "@/types/user";
import { Query } from "@/types/query";
import { withQuery } from "@/lib/withQuery";
import extractDataFromAxios from "@/lib/extractDataFromAxios";
import { WithCount } from "@/types/withCount";
import withToken from "@/lib/withToken";

export const inviteFriend = (recipentId: string, accessToken?: string) => {
  const fn = api.post(
    "/invites",
    {
      recipentId,
    },
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};

export const getInvites = (userId: string, accessToken?: string) => {
  const fn = api.get<{
    receivedInvites: WithCount<ReceivedFriendIvite>;
    sentInvites: WithCount<SentFriendInvite>;
  }>(`users/${userId}/invites`, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const getUserFriends = (
  userId: string,
  query?: Query,
  accessToken?: string,
) => {
  const fn = api.get<WithCount<User>>(
    withQuery(`users/${userId}/friends`, query),
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};

export const getInvitableUsers = (accessToken?: string) => {
  const fn = api.get<WithCount<User>>(
    "/users/invitable",
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};

export const acceptFriend = (inviteId: string, accessToken?: string) => {
  const fn = api.post(
    `/invites/${inviteId}/accept`,
    {},
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};

export const declineInvite = (inviteId: string, accessToken?: string) => {
  const fn = api.delete(`/invites/${inviteId}`, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const removeFriend = (
  userId: string,
  friendId: string,
  accessToken?: string,
) => {
  const fn = api.delete(
    `/users/${userId}/friends/${friendId}`,
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};
