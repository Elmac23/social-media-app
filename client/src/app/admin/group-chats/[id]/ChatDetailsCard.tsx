import { Chat } from "@/types/groupChat";
import DirectChat from "./DirectChatCard";
import GroupChatCard from "./GroupChatCard";

function ChatDetailsCard({
  chat,
  children,
}: React.PropsWithChildren<{ chat: Chat }>) {
  return chat.type === "DIRECT" ? (
    <DirectChat directChat={chat}> {children}</DirectChat>
  ) : (
    <GroupChatCard groupChat={chat}>{children}</GroupChatCard>
  );
}

export default ChatDetailsCard;
