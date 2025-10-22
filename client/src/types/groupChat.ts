import { User } from "./user";

type DirectChat = {
  id: string;
  type: "DIRECT";
  members: [User, User];
};

export type GroupChat =
  | DirectChat
  | {
      id: string;
      type: "GROUP";
      avatarUrl: string;
      name: string;
      description: string;
      members: User[];
    };
