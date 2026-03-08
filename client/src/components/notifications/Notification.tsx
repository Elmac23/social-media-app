"use client";

import React from "react";
import type { Notification } from "@/types/notification";
import Link from "next/link";
import IconButton from "../ui/IconButton";
import { MdClose } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { deleteNotification } from "@/api/notifications";
import Avatar from "../ui/Avatar";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import Typography from "../ui/Typography";
type NotificationProps = {
  notification: Notification;
  onDelete: (id: string) => void;
};

function Notification({ notification, onDelete }: NotificationProps) {
  const text = getNotificationText(notification);

  const { mutate } = useMutation({
    mutationFn: () => deleteNotification(notification.id),
    onSuccess: () => {
      onDelete(notification.id);
    },
  });

  const fullName = `${notification.sender.name} ${notification.sender.lastname}`;
  return (
    <div className="flex items-center justify-between px-4 py-2 hover:bg-background/50 rounded-lg">
      <Link
        href={notification.redirectUrl}
        onClick={() => {
          switch (notification.notificationType) {
            case "FRIEND_REQUEST":
            case "FRIEND_REQUEST_ACCEPTED":
            case "NEW_FOLLOWER":
              break;
            default:
              mutate();
          }
        }}
        className="flex items-center gap-2 flex-1"
      >
        <Avatar
          alt={notification.sender.login}
          url={getAvatarUrl(notification.sender.avatarUrl)}
          className="self-start"
        />
        <Typography>
          <Typography
            bold
            as="span"
            className="text-primary-500 inline-block mr-2"
          >
            {fullName}
          </Typography>
          <Typography as="span">{text}</Typography>
        </Typography>
      </Link>
      <IconButton onClick={() => mutate()} variant="secondary">
        <MdClose />
      </IconButton>
    </div>
  );
}

function getNotificationText(notification: Notification) {
  switch (notification.notificationType) {
    case "COMMENT_LIKE":
      return `liked your comment`;
    case "COMMENT_RESPONSE":
      return `replied to your comment`;
    case "FRIEND_REQUEST":
      return `sent you a friend request`;
    case "FRIEND_REQUEST_ACCEPTED":
      return `accepted your friend request`;
    case "POST_COMMENT":
      return `commented on your post`;
    case "POST_LIKE":
      return `liked your post`;
    case "POST_SHARE":
      return `shared your post`;
    case "NEW_FOLLOWER":
      return `started following you`;
    case "NEW_MESSAGE":
      return notification.entityName
        ? `sent a message to ${notification.entityName}`
        : `sent you a message`;
    case "GROUPCHAT_ADDED":
      return `added you to ${notification.entityName}`;
    case "GROUPCHAT_REMOVED":
      return `removed you from ${notification.entityName}`;
    default:
      return "You have a new notification";
  }
}

export default Notification;
