import { Message } from "./message";
import { User } from "./user";

export type DirectChat = {
  id: string;
  type: "DIRECT";
  members: [User, User];
  messages: Message[];
};

export type GroupChat = {
  id: string;
  type: "GROUP";
  avatarUrl: string;
  name: string;
  description: string;
  createdAt: string;
  members?: User[];
  membersCount?: number;
  messages: Message[];
};

export type Chat = DirectChat | GroupChat;

export type CreateGroupChat = {
  name?: string;
  description?: string;
  avatarUrl?: string;
  memberIds: string[];
  type: "GROUP" | "DIRECT";
};
