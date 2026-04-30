"use client";
import React from "react";
import AdminTab from "../../AdminTab";
import { getPostComments } from "@/api/comments";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { Tr, Td } from "@/components/ui/table";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import { parseMaxLength } from "@/lib/parseMaxLength";
import { formatDate } from "date-fns";
import { MdInfo } from "react-icons/md";

function PostComments({ id }: { id: string }) {
  return (
    <AdminTab
      queryFn={(q) => getPostComments(id, q)}
      title="Comments"
      queryKey={`${id}-comments`}
      renderDescription={(data) => `Total Comments: ${data.count}`}
      renderRow={(comment) => (
        <Tr key={comment.id}>
          <Td rowName="Id">{parseMaxLength(comment.id, 10)}</Td>
          <Td rowName="Created At">
            {formatDate(comment.createdAt, "dd/MM/yyyy hh:mm:ss")}
          </Td>
          <Td rowName="Avatar">
            <Avatar
              alt={comment.author.name}
              url={getAvatarUrl(comment.author.avatarUrl)}
              className="inline-block"
            />
          </Td>
          <Td rowName="Author">{`@${comment.author.login} ${comment.author.name} ${comment.author.lastname}`}</Td>
          <Td rowName="Likes">{comment.likesCount}</Td>
          <Td rowName="Responses">{comment.subCommentsCount}</Td>
          <Td rowName="Content">{parseMaxLength(comment.content)}</Td>
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
        "",
        { display: "Author", key: "author" },
        { display: "Likes", key: "likes" },
        { display: "Responses", key: "responses" },
        { display: "Content", key: "content" },
        "Action",
      ]}
    />
  );
}

export default PostComments;
