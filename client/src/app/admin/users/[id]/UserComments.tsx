"use client";

import { getUserComments } from "@/api/comments";
import Button from "@/components/ui/Button";
import { Td, Tr } from "@/components/ui/table";
import { parseMaxLength } from "@/lib/parseMaxLength";
import { formatDate } from "date-fns";
import AdminTab from "../../AdminTab";
import { MdInfo } from "react-icons/md";
import ButtonLink from "@/components/ui/ButtonLink";

function UserComments({ id }: { id: string }) {
  return (
    <AdminTab
      queryFn={(query) => getUserComments(id, query)}
      title="Comments"
      queryKey="comments"
      renderDescription={(data) => `Total Comments: ${data.count}`}
      renderRow={(comment) => (
        <Tr key={comment.id}>
          <Td rowName="Id">{parseMaxLength(comment.id, 10)}</Td>
          <Td rowName="Created At">
            {formatDate(comment.createdAt, "dd/MM/yyyy hh:mm:ss")}
          </Td>

          <Td rowName="Likes">{comment.likesCount}</Td>
          <Td rowName="Responses">{comment.subCommentsCount}</Td>
          <Td rowName="Content">{parseMaxLength(comment.content)}</Td>
          <Td>
            <div className="flex gap-2">
              <ButtonLink
                href={`/admin/comments/${comment.id}`}
                icon={<MdInfo />}
              >
                Details
              </ButtonLink>
              <Button variant="ghost">Delete</Button>
            </div>
          </Td>
        </Tr>
      )}
      tableColumns={[
        { display: "Id", key: "id" },
        { display: "Created At", key: "createdAt" },

        { display: "Likes", key: "likes" },
        { display: "Responses", key: "responses" },
        { display: "Content", key: "content" },
        "Action",
      ]}
    />
  );
}

export default UserComments;
