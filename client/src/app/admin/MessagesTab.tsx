"use client";
import { getMessages } from "@/api/messages";
import AdminTab from "./AdminTab";
import { Td, Tr } from "@/components/ui/table";
import { parseMaxLength } from "@/lib/parseMaxLength";
import { formatDate } from "date-fns";
import Button from "@/components/ui/Button";

function MessagesTab() {
  return (
    <AdminTab
      queryFn={getMessages}
      title="Messages"
      queryKey="messages"
      renderDescription={(data) => `Total Messages: ${data.count}`}
      renderRow={(message) => (
        <Tr key={message.id}>
          <Td>{parseMaxLength(message.id, 10)}</Td>
          <Td>{formatDate(message.createdAt, "dd/MM/yyyy hh:mm:ss")}</Td>
          <Td>{`@${message.sender.login} ${message.sender.name} ${message.sender.lastname}`}</Td>
          <Td>{parseMaxLength(message.groupChatId, 10)}</Td>
          <Td>{parseMaxLength(message.content)}</Td>
          <Td className="flex gap-2">
            <Button>Details</Button>
            <Button variant="ghost">Delete</Button>
          </Td>
        </Tr>
      )}
      tableColumns={[
        { display: "Id", key: "id" },
        { display: "Created At", key: "createdAt" },
        { display: "Author", key: "author" },
        { display: "Group Chat Id", key: "groupChatId" },
        { display: "Content", key: "content" },
        "Action",
      ]}
    />
  );
}

export default MessagesTab;
