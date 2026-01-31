import { getUsersGroupChats } from "@/api/groupChats";
import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";
import React from "react";
import GroupChatList from "./GroupChatList";

type ChatLayoutProps = React.PropsWithChildren & {};

async function ChatLayout({ children }: ChatLayoutProps) {
  const user = await getUser();
  if (!user) redirect("/auth/login");
  const groupChats = await getUsersGroupChats(user.accessToken, user.id);
  return (
    <main className="max-w-7xl mx-auto p-8">
      <Typography size="2xl" bold className="mb-4">
        Chats
      </Typography>
      <Card className="flex divide-black/50 gap-4 divide-x h-175">
        <GroupChatList groupChats={groupChats.data}></GroupChatList>

        {children}
      </Card>
    </main>
  );
}

export default ChatLayout;
