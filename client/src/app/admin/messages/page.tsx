"use client";

import { getMessages } from "@/api/messages";
import Button from "@/components/ui/Button";
import { Td, Tr } from "@/components/ui/table";
import { parseMaxLength } from "@/lib/parseMaxLength";
import { formatDate } from "date-fns";
import React from "react";
import AdminTab from "../AdminTab";
import comment from "@/components/comment";
import Avatar from "@/components/ui/Avatar";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import { MdInfo } from "react-icons/md";
import ButtonLink from "@/components/ui/ButtonLink";

function MessagesPage() {
  return (
    <AdminTab
      queryFn={getMessages}
      title="Messages"
      queryKey="messages"
      renderDescription={(data) => `Total Messages: ${data.count}`}
      renderRow={(message) => (
        <Tr key={message.id}>
          <Td rowName="Id">{parseMaxLength(message.id, 10)}</Td>
          <Td rowName="Created At">
            {formatDate(message.createdAt, "dd/MM/yyyy hh:mm:ss")}
          </Td>
          <Td rowName="Avatar">
            <Avatar
              alt={message.sender.name}
              url={getAvatarUrl(message.sender.avatarUrl)}
              className="inline-block"
            />
          </Td>
          <Td rowName="Author">{`@${message.sender.login} ${message.sender.name} ${message.sender.lastname}`}</Td>
          <Td rowName="Group Chat Id">
            {parseMaxLength(message.groupChatId, 10)}
          </Td>
          <Td rowName="Content">{parseMaxLength(message.content)}</Td>
          <Td>
            <div className="flex gap-2">
              <ButtonLink
                href={`/admin/messages/${message.id}`}
                icon={<MdInfo />}
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
        "",
        { display: "Author", key: "author" },
        { display: "Group Chat Id", key: "groupChatId" },
        { display: "Content", key: "content" },
        "Action",
      ]}
    />
  );
}

export default MessagesPage;
