import { CreateGroupChat, GroupChat } from "@/types/groupChat";
import { api } from ".";
import { Query } from "@/types/query";
import { withQuery } from "@/lib/withQuery";
import { UpdateGroupChatDto } from "@/app/chat/[id]/GroupChatEdit";

export const getUsersGroupChats = (
  token: string,
  userId: string,
  query?: Query,
) => {
  const url = withQuery(`/users/${userId}/group-chats`, query);
  return api.get<GroupChat[]>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateGroupChat = (
  token: string,
  groupChatId: string,
  data: UpdateGroupChatDto,
) => {
  return api.patch(`/group-chats/${groupChatId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createGroupChat = (
  token: string,
  groupChatData: CreateGroupChat,
) => {
  return api.post<GroupChat>(`/group-chats`, groupChatData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getGroupChatById = (token: string, groupChatId: string) => {
  return api.get<GroupChat>(`/group-chats/${groupChatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeFromGroupChat = (
  token: string,
  groupChatId: string,
  userId: string,
) => {
  return api.delete(`/group-chats/${groupChatId}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addMember = (
  token: string,
  groupChatId: string,
  userId: string,
) => {
  return api.post(`/group-chats/${groupChatId}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
