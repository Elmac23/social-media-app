import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import { getUser } from "@/lib/getUser";
import UserDataCard from "../../users/[id]/UserDataCard";
import ButtonLink from "@/components/ui/ButtonLink";
import Badge from "@/components/ui/badge";
import { formatDate } from "date-fns";

import { getMessageById } from "@/api/messages";
import { getUserProfileById } from "@/api/users";
import GroupChatCard from "../../group-chats/[id]/GroupChatCard";
import { getGroupChatById } from "@/api/groupChats";
import ChatDetailsCard from "../../group-chats/[id]/ChatDetailsCard";

type CommentDataProps = {
  params: Promise<{ id: string }>;
};

async function MessageDataPage({ params }: CommentDataProps) {
  const you = await getUser();
  const { id } = await params;
  const message = await getMessageById(id, you?.accessToken);
  const userProfile = await getUserProfileById(
    message.senderId,
    you?.accessToken,
  );
  const groupChat = await getGroupChatById(
    message.groupChatId,
    you?.accessToken,
  );

  return (
    <div className="p-2">
      <div className="grid xl:grid-cols-2 gap-4">
        <Card>
          <Typography as="h2" size="xl" bold className="mb-2">
            Message Data
          </Typography>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>Id: {message.id}</Badge>
            <Badge>
              Created at {formatDate(message.createdAt, "dd/MM/yyyy")}
            </Badge>
          </div>
          <Typography bold className="mb-2">
            Content:
          </Typography>
          <Typography
            as="pre"
            className="border-[1px] rounded-sm border-border p-2 mb-4"
          >
            {message.content}
          </Typography>
        </Card>
        <ChatDetailsCard chat={groupChat}>
          <ButtonLink
            variant="outline"
            className="inline-block mt-4"
            href={`/admin/users/${message.senderId}`}
          >
            Browse
          </ButtonLink>
        </ChatDetailsCard>

        <div className="row-start-2">
          <UserDataCard user={userProfile}>
            <ButtonLink
              variant="outline"
              className="inline-block mt-4"
              href={`/admin/users/${message.sender.id}`}
            >
              Browse
            </ButtonLink>
          </UserDataCard>
        </div>
      </div>
    </div>
  );
}

export default MessageDataPage;
