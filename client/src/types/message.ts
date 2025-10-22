import { User } from "./user";

export type Message = {
  id: string;
  groupChatId: string;
  senderId: string;
  sender: User;
  content: string;
  createdAt: string;
};
