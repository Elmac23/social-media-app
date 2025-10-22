"use client";

import { ReceivedFriendIvite, SentFriendInvite } from "@/types/friendRequest";
import { User } from "@/types/user";
import React from "react";
import UsersList from "./UsersList";
import Input from "@/components/ui/formControl/Input";
import { useDebounce } from "@/hooks/useDebounce";
import FormControl from "@/components/ui/formControl";
import Label from "@/components/ui/formControl/Label";

type UsersListProps = {
  users: User[];
  receivedInvites: ReceivedFriendIvite[];
  sentInvites: SentFriendInvite[];
};

function UsersListWithSearch({
  users,
  receivedInvites,
  sentInvites,
}: UsersListProps) {
  const [search, setSearch] = React.useState("");
  const [filteredUsers, setFilteredUsers] = React.useState(users);

  const userFilter = function (user: User) {
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.login.toLowerCase().includes(search.toLowerCase()) ||
      user.lastname?.toLowerCase().includes(search.toLowerCase())
    );
  };

  useDebounce(
    () => {
      setFilteredUsers(users.filter(userFilter));
    },
    200,
    [users, search]
  );

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  return (
    <div className="space-y-4">
      <FormControl>
        <Label>Search Users</Label>
        <Input
          value={search}
          onInput={handleInput}
          className="inline-block w-min"
          placeholder="Search by name or login"
        />
      </FormControl>

      <UsersList
        receivedInvites={receivedInvites}
        sentInvites={sentInvites}
        users={filteredUsers}
      />
    </div>
  );
}

export default UsersListWithSearch;
