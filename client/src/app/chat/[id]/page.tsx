import { getGroupChatsMessages } from "@/api/messages";
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";
import React from "react";
import JSONDebug from "@/components/JSONDebug";
import MessagesList from "./MessagesList";

type ChatPageProps = {
  params: Promise<{ id: string }>;
};

async function ChatPage({ params }: ChatPageProps) {
  const id = (await params).id;
  const user = await getUser();
  if (!user) redirect("/auth/login");
  const messages = await getGroupChatsMessages(user.accessToken, id);
  return <MessagesList initialMessages={messages.data} groupChatId={id} />;
}

export default ChatPage;
