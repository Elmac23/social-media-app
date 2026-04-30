"use client";

import { getGroupChatsMessages } from "@/api/messages";
import Avatar from "@/components/ui/Avatar";
import { Tr, Td } from "@/components/ui/table";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import { parseMaxLength } from "@/lib/parseMaxLength";
import { formatDate } from "date-fns";
import React from "react";
import { MdInfo } from "react-icons/md";
import AdminTab from "../../AdminTab";
import ButtonLink from "@/components/ui/ButtonLink";

function GroupChatMessages({ id }: { id: string }) {
  return (
    <AdminTab
      queryFn={(q) => getGroupChatsMessages(id, q)}
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
        { display: "Content", key: "content" },
        "Action",
      ]}
    />
  );
}

export default GroupChatMessages;
