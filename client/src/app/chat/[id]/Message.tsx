import Typography from "@/components/ui/Typography";
import type { Message } from "@/types/message";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import Avatar from "@/components/ui/Avatar";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import { cn } from "@/lib/cn";

type MessageProps = {
  message: Message;
  isYourMessage?: boolean;
};

function Message({ message, isYourMessage }: MessageProps) {
  const senderName = `${message.sender.name} ${message.sender.lastname}`;
  const timeSpan = formatDistanceToNow(new Date(message.createdAt), {
    addSuffix: true,
  });
  return (
    <li className={cn("flex", isYourMessage ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex items-center space-x-2 group",
          isYourMessage ? "flex-row-reverse space-x-reverse" : ""
        )}
      >
        <Avatar alt={senderName} url={getAvatarUrl(message.sender.avatarUrl)} />
        <div>
          <div
            className={cn(
              "flex items-center mb-1 space-x-2",
              isYourMessage ? "flex-row-reverse space-x-reverse" : ""
            )}
          >
            <Typography size="sm" as="span" className="inline-block mr-4">
              {senderName}
            </Typography>
            <Typography
              size="sm"
              as="span"
              className="hidden group-hover:inline"
            >
              {timeSpan}
            </Typography>
          </div>
          <div
            className={cn(
              "py-2 px-4 rounded-lg w-max",
              isYourMessage
                ? "bg-background ml-auto"
                : "bg-primary-500 text-primary-foreground"
            )}
          >
            {message.content}
          </div>
        </div>
      </div>
    </li>
  );
}

export default Message;
