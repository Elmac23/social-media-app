"use client";

import { getUsersGroupChats } from "@/api/groupChats";
import Button from "@/components/ui/Button";
import { Td, Tr } from "@/components/ui/table";
import { parseMaxLength } from "@/lib/parseMaxLength";
import { formatDate } from "date-fns";
import React from "react";
import AdminTab from "../../AdminTab";
import { MdInfo } from "react-icons/md";

function UserGroupChats({ id }: { id: string }) {
  return (
    <AdminTab
      queryFn={(q) => getUsersGroupChats(id, q)}
      title="Group Chats"
      queryKey={`${id}-groupchats`}
      renderDescription={(data) => `Total Group Chats: ${data.count}`}
      renderRow={(groupChat) => (
        <Tr key={groupChat.id}>
          <Td rowName="Id">{parseMaxLength(groupChat.id, 10)}</Td>
          <Td rowName="Created At">
            {formatDate(groupChat.createdAt, "dd/MM/yyyy hh:mm:ss")}
          </Td>
          <Td rowName="Name">{groupChat.name}</Td>
          <Td rowName="Description">{parseMaxLength(groupChat.description)}</Td>
          <Td rowName="Members">{groupChat.membersCount}</Td>
          <Td rowName="Messages">{groupChat.messagesCount}</Td>
          <Td rowName="Type">{groupChat.type}</Td>
          <Td>
            <div className="flex gap-2">
              <Button icon={<MdInfo />}>Details</Button>
              <Button variant="ghost">Delete</Button>
            </div>
          </Td>
        </Tr>
      )}
      tableColumns={[
        { display: "Id", key: "id" },
        { display: "Created At", key: "createdAt" },
        { display: "Name", key: "name" },
        { display: "Description", key: "description" },
        { display: "Members", key: "members" },
        { display: "Messages", key: "messages" },
        { display: "Type", key: "type" },
        "Action",
      ]}
    />
  );
}

export default UserGroupChats;
