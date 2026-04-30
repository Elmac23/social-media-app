"use client";

import Badge from "@/components/ui/badge";
import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";

import type { DirectChat } from "@/types/groupChat";
import { formatDate } from "date-fns";

import { getAvatarUrl } from "@/lib/getAvatarUrl";
import Avatar from "@/components/ui/Avatar";
import ButtonLink from "@/components/ui/ButtonLink";

function DirectChatCard({
  directChat,
  children,
}: React.PropsWithChildren<{ directChat: DirectChat }>) {
  const users = directChat.members;
  return (
    <Card className="col-span-1">
      <Typography as="h2" size="xl" bold className="mb-2">
        Direct Chat
      </Typography>
      <div className="flex flex-wrap mb-4 gap-2">
        <Badge>ID: {directChat.id}</Badge>
        <Badge>
          Created At: {formatDate(directChat.createdAt, "dd/MM/yyyy")}
        </Badge>
        <Badge>{directChat.type}</Badge>
      </div>
      <div>
        <ul className="mb-4 flex flex-col gap-2 divide-none bg-transparent">
          <li className="p-4 rounded-lg flex items-center bg-background transition-colors hover:bg-background/40">
            {users[0] ? (
              <>
                <Avatar
                  alt={users[0].login}
                  url={getAvatarUrl(users[0].avatarUrl)}
                  className="mr-2"
                />
                <Typography as="span" className="mr-4" bold>
                  @{users[0].login}
                </Typography>
                <Typography as="span">
                  {users[0].name} {users[0].lastname}
                </Typography>
                <ButtonLink
                  variant="outline"
                  size="small"
                  className="ml-auto"
                  href={`/admin/users/${users[0].id}`}
                >
                  Browse
                </ButtonLink>
              </>
            ) : (
              <Typography bold>Deleted Account</Typography>
            )}
          </li>

          <li className="p-4 rounded-lg flex items-center bg-background transition-colors hover:bg-background/40">
            {users[1] ? (
              <>
                <Avatar
                  alt={users[1].login}
                  url={getAvatarUrl(users[1].avatarUrl)}
                  className="mr-2"
                />
                <Typography as="span" className="mr-4" bold>
                  @{users[1].login}
                </Typography>
                <Typography as="span">
                  {users[1].name} {users[1].lastname}
                </Typography>
                <ButtonLink
                  variant="outline"
                  size="small"
                  className="ml-auto"
                  href={`/admin/users/${users[1].id}`}
                >
                  Browse
                </ButtonLink>
              </>
            ) : (
              <Typography bold>Deleted Account</Typography>
            )}
          </li>
        </ul>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge>Messages: {directChat.messagesCount}</Badge>
      </div>
      {children}
    </Card>
  );
}

export default DirectChatCard;
