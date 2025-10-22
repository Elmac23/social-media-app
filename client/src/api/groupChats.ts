import { GroupChat } from "@/types/groupChat";
import { api } from ".";
import { Query } from "@/types/query";
import { withQuery } from "@/lib/withQuery";

export const getUsersGroupChats = (
  token: string,
  userId: string,
  query?: Query
) => {
  const url = withQuery(`/users/${userId}/group-chats`, query);
  return api.get<GroupChat[]>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
