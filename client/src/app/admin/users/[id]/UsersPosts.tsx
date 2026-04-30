"use client";

import { getUsersPosts } from "@/api/posts";
import ButtonLink from "@/components/ui/ButtonLink";
import { Td, Tr } from "@/components/ui/table";
import { parseMaxLength } from "@/lib/parseMaxLength";
import { formatDate } from "date-fns";
import React from "react";
import { MdInfo, MdBlock } from "react-icons/md";
import AdminTab from "../../AdminTab";

function UsersPosts({ id }: { id: string }) {
  return (
    <AdminTab
      queryFn={() => getUsersPosts(id)}
      queryKey={`${id}-posts`}
      title="Posts"
      renderDescription={(data) => `Total Posts: ${data.count}`}
      renderRow={(post) => (
        <Tr key={post.id}>
          <Td rowName="Id">{parseMaxLength(post.id, 10)}</Td>
          <Td rowName="Created At">
            {formatDate(post.createdAt, "dd/MM/yyyy hh:mm:ss")}
          </Td>
          <Td rowName="Content">{parseMaxLength(post.content)}</Td>
          <Td rowName="Likes">{post.likesCount}</Td>
          <Td rowName="Responses">{post.commentsCount}</Td>
          <Td rowName="Reposts">{post.sharedPostsCount}</Td>
          <Td>
            <div className="flex gap-4 justify-end">
              <ButtonLink href={`/admin/posts/${post.id}`} icon={<MdInfo />}>
                Details
              </ButtonLink>
              <ButtonLink variant="ghost" href="#" icon={<MdBlock />}>
                Delete
              </ButtonLink>
            </div>
          </Td>
        </Tr>
      )}
      tableColumns={[
        {
          display: "Id",
          key: "id",
        },

        {
          display: "Created At",
          key: "createdAt",
        },

        {
          display: "Content",
          key: "content",
        },
        {
          display: "Likes",
          key: "likes",
        },
        {
          display: "Responses",
          key: "responses",
        },
        {
          display: "Reposts",
          key: "reposts",
        },
        "Action",
      ]}
    />
  );
}

export default UsersPosts;
