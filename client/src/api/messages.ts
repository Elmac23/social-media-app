import { Query } from "@/types/query";
import { api } from ".";
import { Message } from "@/types/message";
import { withQuery } from "@/lib/withQuery";

export const getGroupChatsMessages = (
  token: string,
  chatId: string,
  query?: Query
) => {
  const url = withQuery(`/group-chats/${chatId}/messages`, query);
  return api.get<Message[]>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const sendGroupChatMessage = (message: Message, token: string) => {
  return api.post("/messages", message, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
