import { ReceivedFriendIvite, SentFriendInvite } from "@/types/friendRequest";
import { api } from ".";
import { User } from "@/types/user";

export const inviteFriend = (token: string, recipentId: string) => {
  return api.post(
    "/invites",
    {
      recipentId,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getInvites = (userId: string, token: string) => {
  return api.get<{
    receivedInvites: ReceivedFriendIvite[];
    sentInvites: SentFriendInvite[];
  }>(`users/${userId}/invites`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUserFriends = (userId: string, token: string) => {
  return api.get<User[]>(`users/${userId}/friends`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getInvitableUsers = (token: string) => {
  return api.get<User[]>("/users/invitable", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const acceptFriend = (inviteId: string, token: string) => {
  return api.post(
    `/invites/${inviteId}/accept`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const declineInvite = (token: string, inviteId: string) => {
  return api.delete(`/invites/${inviteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeFriend = (
  userId: string,
  friendId: string,
  token: string
) => {
  return api.delete(`/users/${userId}/friends/${friendId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
