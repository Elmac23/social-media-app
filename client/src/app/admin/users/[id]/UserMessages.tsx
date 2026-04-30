"use client";

import { getUserMessages } from "@/api/messages";
import Button from "@/components/ui/Button";
import { Td, Tr } from "@/components/ui/table";
import { parseMaxLength } from "@/lib/parseMaxLength";
import { formatDate } from "date-fns";
import AdminTab from "../../AdminTab";
import { MdInfo } from "react-icons/md";

function UserMessages({ id }: { id: string }) {
  return (
    <AdminTab
      queryFn={(q) => getUserMessages(id, q)}
      title="Messages"
      queryKey={`${id}-messages`}
      renderDescription={(data) => `Total Messages: ${data.count}`}
      renderRow={(message) => (
        <Tr key={message.id}>
          <Td rowName="Id">{parseMaxLength(message.id, 10)}</Td>
          <Td rowName="Created At">
            {formatDate(message.createdAt, "dd/MM/yyyy hh:mm:ss")}
          </Td>
          <Td rowName="Group Chat Id">
            {parseMaxLength(message.groupChatId, 10)}
          </Td>
          <Td rowName="Content">{parseMaxLength(message.content)}</Td>
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

        { display: "Group Chat Id", key: "groupChatId" },
        { display: "Content", key: "content" },
        "Action",
      ]}
    />
  );
}

export default UserMessages;
