"use client";

import Avatar from "@/components/ui/Avatar";
import Typography from "@/components/ui/Typography";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import Link from "next/link";
import React, { useRef } from "react";
import { Chat } from "@/types/groupChat";
import { cn } from "@/lib/cn";

type GroupChatProps = {
  groupChat: Chat;
  activeGroupChatId: string;
  userId: string;
  currentSearch?: string;
  isNotification?: boolean;
};

function GroupChatComponent({
  groupChat,
  userId,
  activeGroupChatId,
  currentSearch,
  isNotification,
}: GroupChatProps) {
  const chatName = useRef("some chat");
  const chatAvatarUrl = useRef("");
  const url = currentSearch
    ? `/chat/${groupChat.id}?search=${currentSearch}`
    : `/chat/${groupChat.id}`;
  if (groupChat.type === "DIRECT") {
    const differentUser = groupChat.members.filter(
      (chatUser) => chatUser.id !== userId,
    )[0];
    chatName.current = `${differentUser.name} ${differentUser.lastname}`;
    chatAvatarUrl.current = getAvatarUrl(differentUser.avatarUrl);
  } else {
    chatName.current = groupChat.name
      ? groupChat.name
      : groupChat.members
          .map((member) => {
            return `${member.name} ${member.lastname}`;
          })
          .join(", ");
    chatAvatarUrl.current = getAvatarUrl(groupChat.avatarUrl);
  }

  const newestMessage = groupChat.messages[0];
  const chatSubText = newestMessage
    ? `${newestMessage.sender.name} ${newestMessage.sender.lastname}: ${newestMessage.content}`
    : "";

  return (
    <li>
      <Link
        href={url}
        className="flex gap-4 p-4 hover:bg-background/50 rounded-md items-center"
      >
        <Avatar
          alt={chatName.current}
          url={chatAvatarUrl.current}
          className={cn(isNotification && "ring-4 ring-primary-500")}
        />
        <div>
          <Typography
            bold
            as="h3"
            className={cn(
              "truncate w-60",
              activeGroupChatId === groupChat.id && "text-primary-500",
            )}
          >
            {chatName.current}
          </Typography>
          <Typography
            as="p"
            size="sm"
            className={cn(
              "truncate w-60",
              activeGroupChatId === groupChat.id && "text-primary-500",
            )}
          >
            {chatSubText?.length > 30
              ? chatSubText?.slice(0, 30) + "..."
              : chatSubText}
          </Typography>
        </div>
      </Link>
    </li>
  );
}

export default GroupChatComponent;
