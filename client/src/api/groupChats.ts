import { CreateGroupChat, GroupChat } from "@/types/groupChat";
import { api } from ".";
import { Query } from "@/types/query";
import { withQuery } from "@/lib/withQuery";
import { UpdateGroupChatDto } from "@/app/chat/[id]/GroupChatEdit";
import extractDataFromAxios from "@/lib/extractDataFromAxios";
import { WithCount } from "@/types/withCount";
import withToken from "@/lib/withToken";

export const getGroupChats = (query: Query, accessToken?: string) => {
  const url = withQuery(`/group-chats`, query);
  const fn = api.get<WithCount<GroupChat>>(url, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const getUsersGroupChats = (
  userId: string,
  query?: Query,
  accessToken?: string,
) => {
  const url = withQuery(`/users/${userId}/group-chats`, query);
  const fn = api.get<WithCount<GroupChat>>(url, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const updateGroupChat = (
  groupChatId: string,
  data: UpdateGroupChatDto,
  accessToken?: string,
) => {
  const fn = api.patch(
    `/group-chats/${groupChatId}`,
    data,
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};

export const createGroupChat = (
  groupChatData: CreateGroupChat,
  accessToken?: string,
) => {
  const fn = api.post<GroupChat>(
    `/group-chats`,
    groupChatData,
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};

export const getGroupChatById = (groupChatId: string, accessToken?: string) => {
  const fn = api.get<GroupChat>(
    `/group-chats/${groupChatId}`,
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};

export const removeFromGroupChat = (
  groupChatId: string,
  userId: string,
  accessToken?: string,
) => {
  const fn = api.delete(
    `/group-chats/${groupChatId}/users/${userId}`,
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};

export const addMember = (
  groupChatId: string,
  userId: string,
  accessToken?: string,
) => {
  const fn = api.post(
    `/group-chats/${groupChatId}/users/${userId}`,
    {},
    withToken(accessToken),
  );
  return extractDataFromAxios(fn);
};
