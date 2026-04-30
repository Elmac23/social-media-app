"use client";

import { getGroupChats } from "@/api/groupChats";
import { Td, Tr } from "@/components/ui/table";
import { parseMaxLength } from "@/lib/parseMaxLength";
import { formatDate } from "date-fns";
import React from "react";
import AdminTab from "../AdminTab";
import { MdInfo } from "react-icons/md";
import ButtonLink from "@/components/ui/ButtonLink";

function GroupChatsPage() {
  return (
    <AdminTab
      queryFn={getGroupChats}
      title="Group Chats"
      queryKey="group-chats"
      renderDescription={(data) => `Total Group Chats: ${data.count}`}
      renderRow={(groupChat) => (
        <Tr key={groupChat.id}>
          <Td rowName="Id">{parseMaxLength(groupChat.id, 10)}</Td>
          <Td rowName="Created At">
            {formatDate(groupChat.createdAt, "dd/MM/yyyy hh:mm:ss")}
          </Td>
          <Td rowName="Name">{groupChat.name}</Td>
          <Td rowName="Description">{parseMaxLength(groupChat.description)}</Td>
          <Td rowName="Members">{groupChat.usersInGroupChatCount}</Td>
          <Td rowName="Messages">{groupChat.messagesCount}</Td>
          <Td rowName="Type">{groupChat.type}</Td>
          <Td>
            <div className="flex gap-2">
              <ButtonLink
                icon={<MdInfo />}
                href={`/admin/group-chats/${groupChat.id}`}
              >
                Details
              </ButtonLink>
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

export default GroupChatsPage;
