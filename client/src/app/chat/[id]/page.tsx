import { getGroupChatsMessages } from "@/api/messages";
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";
import React from "react";
import MessagesList from "./MessagesList";
import { getGroupChatById } from "@/api/groupChats";
import GroupChatHeader from "./GroupChatHeader";
import { tryOrUndefined } from "@/lib/tryOrUndefined";

type ChatPageProps = {
  params: Promise<{ id: string }>;
};

async function ChatPage({ params }: ChatPageProps) {
  const id = (await params).id;
  const user = await getUser();
  if (!user) redirect("/auth/login");
  const messages = await tryOrUndefined(
    getGroupChatsMessages(user.accessToken, id),
  );
  const groupChat = await tryOrUndefined(
    getGroupChatById(user.accessToken, id),
  );

  if (!messages || !groupChat) redirect("/chat");

  return (
    <div className="grow p-4">
      <MessagesList initialMessages={messages.data} groupChatId={id}>
        <GroupChatHeader groupChat={groupChat.data} />
      </MessagesList>
    </div>
  );
}

export default ChatPage;
