"use client";

import { useAuth } from "@/components/AuthProvider";
import IconButton from "@/components/ui/IconButton";
import Typography from "@/components/ui/Typography";
import { useToggle } from "@/hooks/useToggle";
import { Chat } from "@/types/groupChat";
import Link from "next/link";
import React from "react";
import { MdInfo } from "react-icons/md";
import GroupChatInfoModal from "./GroupChatInfoModal";

type GroupChatHeaderProps = {
  groupChat: Chat;
};

function GroupChatHeader({ groupChat }: GroupChatHeaderProps) {
  const { user } = useAuth();
  const isDirect = groupChat.type === "DIRECT";
  const { value, setTrue, setFalse } = useToggle();

  const nameRef = React.useRef<string>("");
  if (isDirect) {
    const otherMember = groupChat.members.find(
      (member) => member.id !== user?.id,
    );
    nameRef.current = otherMember
      ? `${otherMember.name} ${otherMember.lastname}`
      : "Direct Chat";
  } else {
    nameRef.current = groupChat.members
      .map((member) => {
        return `${member.name} ${member.lastname}`;
      })
      .join(", ");
  }

  if (isDirect) {
    const otherUserId = groupChat.members.find(
      (member) => member.id !== user?.id,
    )?.id;
    return (
      <Typography size="xl" bold className="h-min">
        <Link href={`/profile/${otherUserId}`}>{nameRef.current}</Link>
      </Typography>
    );
  }

  return (
    <div className="flex pb-2 justify-between h-min">
      <Typography size="xl" bold>
        {groupChat.name}
      </Typography>
      <IconButton onClick={() => setTrue()} variant="ghost">
        <MdInfo />
      </IconButton>
      <GroupChatInfoModal
        isOpen={value}
        onClose={setFalse}
        groupChat={groupChat}
      />
    </div>
  );
}

export default GroupChatHeader;
