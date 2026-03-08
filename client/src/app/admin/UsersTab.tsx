"use client";
import { getUsers } from "@/api/users";
import AdminTab from "./AdminTab";
import { Td, Tr } from "@/components/ui/table";
import { parseMaxLength } from "@/lib/parseMaxLength";
import Button from "@/components/ui/Button";
import { formatDate } from "date-fns";
function UsersTab() {
  return (
    <AdminTab
      queryFn={getUsers}
      title="Users"
      queryKey="users"
      renderDescription={(data) => `Total Users: ${data.count}`}
      renderRow={(user) => (
        <Tr key={user.id}>
          <Td>{parseMaxLength(user.id, 10)}</Td>
          <Td>{user.login}</Td>
          <Td>{user.name}</Td>
          <Td>{user.lastname}</Td>
          <Td>{user.email}</Td>
          <Td>
            {user.dateOfBirth && formatDate(user.dateOfBirth, "dd/MM/yyyy")}
          </Td>
          <Td>{user.role}</Td>
          <Td className="flex gap-2">
            <Button>Details</Button>
            <Button variant="ghost">Remove</Button>
            <Button variant="ghost">Ban</Button>
          </Td>
        </Tr>
      )}
      tableColumns={[
        {
          display: "Id",
          key: "id",
        },
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

export default UsersTab;
