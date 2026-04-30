"use client";

import { getPosts } from "@/api/posts";
import ButtonLink from "@/components/ui/ButtonLink";
import { Td, Tr } from "@/components/ui/table";
import { parseMaxLength } from "@/lib/parseMaxLength";
import { formatDate } from "date-fns";
import { MdInfo, MdBlock } from "react-icons/md";

import AdminTab from "../AdminTab";
import comment from "@/components/comment";
import Avatar from "@/components/ui/Avatar";
import { getAvatarUrl } from "@/lib/getAvatarUrl";

function PostsPage() {
  return (
    <AdminTab
      queryFn={getPosts}
      title="Posts"
      queryKey="posts"
      renderDescription={(data) => `Total Posts: ${data.count}`}
      renderRow={(post) => (
        <Tr key={post.id}>
          <Td rowName="Id">{parseMaxLength(post.id, 10)}</Td>
          <Td rowName="Created At">
            {formatDate(post.createdAt, "dd/MM/yyyy hh:mm:ss")}
          </Td>
          <Td rowName="Avatar">
            <Avatar
              alt={post.author.name}
              url={getAvatarUrl(post.author.avatarUrl)}
              className="inline-block"
            />
          </Td>
          <Td rowName="Author">{`@${post.author.login} ${post.author.name} ${post.author.lastname}`}</Td>
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
        "",
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

export default PostsPage;
