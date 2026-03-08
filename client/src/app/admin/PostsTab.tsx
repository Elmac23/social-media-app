"use client";

import ButtonLink from "@/components/ui/ButtonLink";

import { Td, Tr } from "@/components/ui/table";
import { MdBlock, MdInfo } from "react-icons/md";
import { getPosts } from "@/api/posts";
import { formatDate } from "date-fns";
import { parseMaxLength } from "@/lib/parseMaxLength";
import AdminTab from "./AdminTab";

function PostsTab() {
  return (
    <AdminTab
      queryFn={getPosts}
      title="Posts"
      queryKey="posts"
      renderDescription={(data) => `Total Posts: ${data.count}`}
      renderRow={(post) => (
        <Tr key={post.id}>
          <Td>{parseMaxLength(post.id, 10)}</Td>
          <Td>{formatDate(post.createdAt, "dd/MM/yyyy hh:mm:ss")}</Td>
          <Td>{`@${post.author.login} ${post.author.name} ${post.author.lastname}`}</Td>
          <Td>{parseMaxLength(post.content)}</Td>
          <Td>{post.likesCount}</Td>
          <Td>{post.commentsCount}</Td>
          <Td>{post.sharedPostsCount}</Td>
          <Td>
            <div className="flex gap-4 justify-end">
              <ButtonLink href="#" icon={<MdInfo />}>
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
          display: "Author",
          key: "author",
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

export default PostsTab;
