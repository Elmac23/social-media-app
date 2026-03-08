"use client";
import { getComments } from "@/api/comments";
import AdminTab from "./AdminTab";
import { Td, Tr } from "@/components/ui/table";
import { parseMaxLength } from "@/lib/parseMaxLength";
import { formatDate } from "date-fns";
import Button from "@/components/ui/Button";

function CommentsTab() {
  return (
    <AdminTab
      queryFn={getComments}
      title="Comments"
      queryKey="comments"
      renderDescription={(data) => `Total Comments: ${data.count}`}
      renderRow={(comment) => (
        <Tr key={comment.id}>
          <Td>{parseMaxLength(comment.id, 10)}</Td>
          <Td>{formatDate(comment.createdAt, "dd/MM/yyyy hh:mm:ss")}</Td>
          <Td>{`@${comment.author.login} ${comment.author.name} ${comment.author.lastname}`}</Td>
          <Td>{comment.likesCount}</Td>
          <Td>{comment.subCommentsCount}</Td>
          <Td>{parseMaxLength(comment.content)}</Td>
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
        { display: "Likes", key: "likes" },
        { display: "Responses", key: "responses" },
        { display: "Content", key: "content" },
        "Action",
      ]}
    />
  );
}

export default CommentsTab;
