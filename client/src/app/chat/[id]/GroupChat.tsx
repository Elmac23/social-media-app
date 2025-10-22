"use client";

import Avatar from "@/components/ui/Avatar";
import Typography from "@/components/ui/Typography";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import Link from "next/link";
import React, { useRef } from "react";
import { GroupChat } from "@/types/groupChat";
import { cn } from "@/lib/cn";

type GroupChatProps = {
  groupChat: GroupChat;
  activeGroupChatId: string;
  userId: string;
  currentSearch?: string;
};

function GroupChatComponent({
  groupChat,
  userId,
  activeGroupChatId,
  currentSearch,
}: GroupChatProps) {
  const chatName = useRef("some chat");
  const chatAvatarUrl = useRef("");
  const url = currentSearch
    ? `/chat/${groupChat.id}?search=${currentSearch}`
    : `/chat/${groupChat.id}`;
  if (groupChat.type === "DIRECT") {
    const differentUser = groupChat.members.filter(
      (chatUser) => chatUser.id !== userId
    )[0];
    chatName.current = `${differentUser.name} ${differentUser.lastname}`;
    chatAvatarUrl.current = getAvatarUrl(differentUser.avatarUrl);
  } else {
    chatName.current = groupChat.members
      .map((member) => {
        return `${member.name} ${member.lastname}`;
      })
      .join(", ");
    chatAvatarUrl.current = getAvatarUrl(groupChat.avatarUrl);
  }

  return (
    <li key={groupChat.id}>
      <Link
        href={url}
        className="flex gap-4 p-4 hover:bg-background/50 rounded-md items-center"
      >
        <Avatar alt={chatName.current} url={chatAvatarUrl.current} />
        <Typography
          bold
          as="span"
          className={cn(
            "truncate w-60",
            activeGroupChatId === groupChat.id && "text-primary-500"
          )}
        >
          {chatName.current}
        </Typography>
      </Link>
    </li>
  );
}

export default GroupChatComponent;
