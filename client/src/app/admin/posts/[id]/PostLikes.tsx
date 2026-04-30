"use client";

import ButtonLink from "@/components/ui/ButtonLink";
import { Td, Tr } from "@/components/ui/table";
import { parseMaxLength } from "@/lib/parseMaxLength";
import { formatDate } from "date-fns";
import React from "react";
import AdminTab from "../../AdminTab";
import Avatar from "@/components/ui/Avatar";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import { getPostLikes } from "@/api/posts";
import { MdInfo } from "react-icons/md";

function PostLikes({ id }: { id: string }) {
  return (
    <AdminTab
      queryFn={(q) => getPostLikes(id, q)}
      title="Liked by"
      queryKey={`${id}-likes`}
      renderDescription={(data) => `Total likes: ${data.count}`}
      renderRow={(like) => (
        <Tr key={like.id}>
          <Td rowName="Id">{parseMaxLength(like.id, 10)}</Td>
          <Td rowName="Created at">
            {formatDate(like.createdAt, "dd/MM/yyyy hh:mm:ss")}
          </Td>
          <Td rowName="Avatar">
            <Avatar
              alt={like.user.name}
              url={getAvatarUrl(like.user.avatarUrl)}
              className="inline-block"
            />
          </Td>
          <Td rowName="Liked by">{`@${like.user.login} ${like.user.name} ${like.user.lastname}`}</Td>
          <Td>
            <div className="flex gap-2">
              <ButtonLink
                href={`/admin/users/${like.user.id}`}
                icon={<MdInfo />}
              >
                Details
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
          display: "Created at",
          key: "likedAt",
        },
        "",

        {
          display: "Liked by",
          key: "user",
        },

        "Action",
      ]}
    />
  );
}

export default PostLikes;
