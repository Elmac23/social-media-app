import Badge from "@/components/ui/badge";
import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import { formatDate } from "date-fns";
import React from "react";
import type { GroupChat } from "@/types/groupChat";

function GroupChatCard({
  groupChat,
  children,
}: React.PropsWithChildren<{ groupChat: GroupChat }>) {
  return (
    <Card className="col-span-1">
      <Typography as="h3" size="lg" bold className="mb-2">
        {groupChat.name}
      </Typography>
      <div className="flex flex-wrap mb-4 gap-2">
        <Badge>ID: {groupChat.id}</Badge>
        <Badge>
          Created At: {formatDate(groupChat.createdAt, "dd/MM/yyyy")}
        </Badge>
        <Badge>
          Updated At: {formatDate(groupChat.updatedAt, "dd/MM/yyyy")}
        </Badge>
        <Badge>{groupChat.type}</Badge>
      </div>
      {groupChat.description && (
        <>
          <Typography bold className="mb-2">
            Description:
          </Typography>
          <Typography
            as="pre"
            className="border-[1px] rounded-sm border-border p-2 mb-4"
          >
            {groupChat.description}
          </Typography>
        </>
      )}
      <div className="flex flex-wrap gap-2">
        <Badge>Members: {groupChat.usersInGroupChatCount}</Badge>

        <Badge>Messages: {groupChat.messagesCount}</Badge>
      </div>
      {children}
    </Card>
  );
}

export default GroupChatCard;
