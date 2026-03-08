"use client";
import { getGroupChats } from "@/api/groupChats";
import AdminTab from "./AdminTab";
import { Td, Tr } from "@/components/ui/table";
import { parseMaxLength } from "@/lib/parseMaxLength";
import { formatDate } from "date-fns";
import Button from "@/components/ui/Button";

function GroupChatsTab() {
  return (
    <AdminTab
      queryFn={getGroupChats}
      title="Group Chats"
      queryKey="group-chats"
      renderDescription={(data) => `Total Group Chats: ${data.count}`}
      renderRow={(groupChat) => (
        <Tr key={groupChat.id}>
          <Td>{parseMaxLength(groupChat.id, 10)}</Td>
          <Td>{formatDate(groupChat.createdAt, "dd/MM/yyyy hh:mm:ss")}</Td>
          <Td>{groupChat.name}</Td>
          <Td>{parseMaxLength(groupChat.description)}</Td>
          <Td>{groupChat.membersCount}</Td>
          <Td>{groupChat.type}</Td>
          <Td className="flex gap-2">
            <Button>Details</Button>
            <Button variant="ghost">Delete</Button>
          </Td>
        </Tr>
      )}
      tableColumns={[
        { display: "Id", key: "id" },
        { display: "Created At", key: "createdAt" },
        { display: "Name", key: "name" },
        { display: "Description", key: "description" },
        { display: "Members", key: "members" },
        { display: "Type", key: "type" },
        "Action",
      ]}
    />
  );
}

export default GroupChatsTab;
