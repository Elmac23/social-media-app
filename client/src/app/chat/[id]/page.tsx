import { getGroupChatsMessages } from "@/api/messages";
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";
import React from "react";
import MessagesList from "./MessagesList";
import { getGroupChatById } from "@/api/groupChats";
import GroupChatHeader from "./GroupChatHeader";
import { tryOrUndefined } from "@/lib/tryOrUndefined";
import MessagesContextProvider from "./MessagesContextProvider";

type ChatPageProps = {
  params: Promise<{ id: string }>;
};

async function ChatPage({ params }: ChatPageProps) {
  const id = (await params).id;
  const user = await getUser();
  if (!user) redirect("/auth/login");
  const messages = await tryOrUndefined(
    getGroupChatsMessages(id, {}, user.accessToken),
  );
  const groupChat = await tryOrUndefined(
    getGroupChatById(id, user.accessToken),
  );

  if (!messages || !groupChat) redirect("/chat");

  return (
    <div className="grow p-4">
      <MessagesContextProvider initialMessages={messages.data} groupChatId={id}>
        <MessagesList>
          <GroupChatHeader groupChat={groupChat} />
        </MessagesList>
      </MessagesContextProvider>
    </div>
  );
}

export default ChatPage;
