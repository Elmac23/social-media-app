"use client";

import ButtonLink from "@/components/ui/ButtonLink";
import { Td, Tr } from "@/components/ui/table";
import { parseMaxLength } from "@/lib/parseMaxLength";
import { formatDate } from "date-fns";
import AdminTab from "../../AdminTab";
import Avatar from "@/components/ui/Avatar";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import { getPostReposts } from "@/api/posts";
import { MdInfo } from "react-icons/md";

function PostShares({ id }: { id: string }) {
  return (
    <AdminTab
      queryFn={(q) => getPostReposts(id, q)}
      title="Shared by"
      queryKey={`${id}-shares`}
      renderDescription={(data) => `Total shares: ${data.count}`}
      renderRow={(repost) => (
        <Tr key={repost.id}>
          <Td rowName="Id">{parseMaxLength(repost.id, 10)}</Td>
          <Td rowName="Shared at">
            {formatDate(repost.createdAt, "dd/MM/yyyy hh:mm:ss")}
          </Td>
          <Td rowName="Avatar">
            <Avatar
              alt={repost.user.name}
              url={getAvatarUrl(repost.user.avatarUrl)}
              className="inline-block"
            />
          </Td>
          <Td rowName="Shared by">{`@${repost.user.login} ${repost.user.name} ${repost.user.lastname}`}</Td>
          <Td>
            <div className="flex gap-2">
              <ButtonLink
                href={`/admin/users/${repost.user.id}`}
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
          display: "Shared at",
          key: "repostedAt",
        },
        "",

        {
          display: "Shared by",
          key: "user",
        },

        "Action",
      ]}
    />
  );
}

export default PostShares;
