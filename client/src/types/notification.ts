import { NotificationDto } from "@/schema/notificationSchema";
import { User } from "./user";

type FlatNotification = NotificationDto & {
  id: string;
  sender: User;
  postId?: string;
  redirectUrl: string;
};

export type PostNotificationType = FlatNotification & {
  notificationType: "POST_LIKE" | "POST_COMMENT" | "POST_SHARE";
  count?: number;
};

export type CommentNotification = FlatNotification & {
  notificationType: "COMMENT_LIKE" | "COMMENT_RESPONSE";
  profileId: string;
  commentId: string;
};

export type FriendNotification = FlatNotification & {
  notificationType:
    | "FRIEND_REQUEST"
    | "FRIEND_REQUEST_ACCEPTED"
    | "NEW_FOLLOWER";
  profileId: string;
};

export type Notification =
  | PostNotificationType
  | CommentNotification
  | FriendNotification;

export type NotificationType = Notification["notificationType"];
