import { Query } from "@/types/query";
import { api } from ".";
import { Message } from "@/types/message";
import { withQuery } from "@/lib/withQuery";
import extractDataFromAxios from "@/lib/extractDataFromAxios";
import { WithCount } from "@/types/withCount";
import withToken from "@/lib/withToken";

export const getMessages = (query: Query, accessToken?: string) => {
  const url = withQuery(`/messages`, query);
  const fn = api.get<WithCount<Message>>(url, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const getGroupChatsMessages = (
  chatId: string,
  query?: Query,
  accessToken?: string,
) => {
  const url = withQuery(`/group-chats/${chatId}/messages`, query);
  const fn = api.get<WithCount<Message>>(url, withToken(accessToken));
  return extractDataFromAxios(fn);
};

export const sendGroupChatMessage = (
  message: Message,
  accessToken?: string,
) => {
  const fn = api.post("/messages", message, withToken(accessToken));
  return extractDataFromAxios(fn);
};
