import { User } from "./user";

export type SentFriendInvite = {
  id: string;
  recipent: User;
  createdAt: string;
};

export type ReceivedFriendIvite = {
  id: string;
  sender: User;
  createdAt: string;
};
