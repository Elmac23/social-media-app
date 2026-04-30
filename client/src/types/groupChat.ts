import { Message } from "./message";
import { User } from "./user";

export type DirectChat = {
  id: string;
  type: "DIRECT";
  members: [User, User];
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  messagesCount?: number;
};

export type GroupChat = {
  id: string;
  type: "GROUP";
  avatarUrl: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  members?: User[];
  usersInGroupChatCount?: number;
  messages: Message[];
  messagesCount?: number;
};

export type Chat = DirectChat | GroupChat;

export type CreateGroupChat = {
  name?: string;
  description?: string;
  avatarUrl?: string;
  memberIds: string[];
  type: "GROUP" | "DIRECT";
};
