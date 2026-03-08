import { User } from "./user";

export type Message = {
  id: string;
  groupChatId: string;
  senderId: string;
  sender: User;
  content: string;
  type: "DEFAULT" | "SYSTEM_REMOVE_USER" | "SYSTEM_ADD_USER";
  createdAt: string;
};
