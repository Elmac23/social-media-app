"use client";

import React from "react";
import type { Notification } from "@/types/notification";
import Link from "next/link";
import IconButton from "../ui/IconButton";
import { MdClose } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { deleteNotification } from "@/api/notifications";
import { useAuth } from "../AuthProvider";
import Avatar from "../ui/Avatar";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import Typography from "../ui/Typography";
type NotificationProps = {
  notification: Notification;
  onDelete: (id: string) => void;
};

function Notification({ notification, onDelete }: NotificationProps) {
  const text = getNotificationText(notification);
  const { accessToken } = useAuth();

  const { mutate } = useMutation({
    mutationFn: () => deleteNotification(notification.id, accessToken),
    onSuccess: () => {
      onDelete(notification.id);
    },
  });

  const fullName = `${notification.sender.name} ${notification.sender.lastname}`;
  return (
    <div className="flex items-center justify-between px-4 py-2 hover:bg-background/50 rounded-lg">
      <Link
        href={notification.redirectUrl}
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
      return `liked your post and he also likes pizza pineapple spiderman blah blah blah test`;
    case "POST_SHARE":
      return `shared your post`;
    case "NEW_FOLLOWER":
      return `started following you`;
    default:
      return "You have a new notification";
  }
}

export default Notification;
