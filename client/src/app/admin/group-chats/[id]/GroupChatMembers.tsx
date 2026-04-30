"use client";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import { Tr, Td } from "@/components/ui/table";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import { parseMaxLength } from "@/lib/parseMaxLength";
import { formatDate } from "date-fns";
import React from "react";
import { MdInfo } from "react-icons/md";
import AdminTab from "../../AdminTab";
import { getGroupChatMembers } from "@/api/groupChats";

function GroupChatMembers({ id }: { id: string }) {
  return (
    <AdminTab
      queryFn={(q) => getGroupChatMembers(id, q)}
      title="Members"
      queryKey={`${id}-members`}
      renderDescription={(data) => `Total Users: ${data.count}`}
      renderRow={(user) => (
        <Tr key={user.id}>
          <Td rowName="Id">{parseMaxLength(user.id, 10)}</Td>
          <Td rowName="Avatar">
            <Avatar
              alt={user.name}
              url={getAvatarUrl(user.avatarUrl)}
              className="inline-block"
            />
          </Td>
          <Td rowName="Login">{user.login}</Td>
          <Td rowName="Name">{user.name}</Td>
          <Td rowName="Last Name">{user.lastname}</Td>
          <Td rowName="Email">{user.email}</Td>
          <Td rowName="Date of Birth">
            {user.dateOfBirth && formatDate(user.dateOfBirth, "dd/MM/yyyy")}
          </Td>
          <Td rowName="Role">{user.role}</Td>
          <Td>
            <div className="flex gap-2">
              <ButtonLink href={`/admin/users/${user.id}`} icon={<MdInfo />}>
                Details
              </ButtonLink>
              <Button variant="ghost">Remove</Button>
              <Button variant="ghost">Ban</Button>
            </div>
          </Td>
        </Tr>
      )}
      tableColumns={[
        {
          display: "Id",
          key: "id",
        },
        "",
        {
          display: "Login",
          key: "login",
        },
        {
          display: "Name",
          key: "name",
        },
        {
          display: "Last Name",
          key: "lastName",
        },
        {
          display: "Email",
          key: "email",
        },
        {
          display: "Date of Birth",
          key: "dateOfBirth",
        },
        {
          display: "Role",
          key: "role",
        },
        "Action",
      ]}
    />
  );
}

export default GroupChatMembers;
