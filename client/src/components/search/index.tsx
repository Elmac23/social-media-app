"use client";

import React from "react";
import Input from "../ui/formControl/Input";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/users";
import Dropdown from "../ui/dropdown";
import DropdownTrigger from "../ui/dropdown/DropdownTrigger";
import DropdownBody from "../ui/dropdown/DropdownBody";

import Typography from "../ui/Typography";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useFocus } from "@/hooks/useFocus";
import RecentSearches from "./RecentSearches";
import { addSearch } from "@/store/searches";
import SearchElement from "./SearchElement";
import { useAppDispatch } from "@/hooks/reduxHooks";

function SearchUsers() {
  const [input, setInput] = React.useState("");
  const [query, setQuery] = React.useState("");
  const dispatch = useAppDispatch();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const { data } = useQuery({
    queryKey: ["search-users", query],
    queryFn: () => getUsers({ limit: 8, page: 1, search: query }),
  });

  const router = useRouter();

  useDebounce(
    () => {
      setQuery(input);
    },
    300,
    [input]
  );
  const isFocus = useFocus(inputRef.current);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() === "") return;
    if (data && data.data.length === 1) {
      dispatch(
        addSearch({
          content: data.data[0].name + " " + data.data[0].lastname,
          avatarUrl: data.data[0].avatarUrl,
          href: `/profile/${data.data[0].id}`,
          type: "USER",
        })
      );
      return router.push(`/profile/${data?.data[0].id}`);
    }
    dispatch(
      addSearch({
        content: input,
        href: `/search?query=${input}`,
        type: "SEARCH",
      })
    );
    router.push(`/search?query=${input}`);
  };

  const isEmptyInput = input.trim() === "";

  return (
    <form onSubmit={handleSubmit}>
      <Dropdown isOpen={isFocus}>
        <DropdownTrigger>
          <Input
            placeholder="Search users..."
            value={input}
            onInput={(e) => setInput(e.currentTarget.value)}
            ref={inputRef}
          />
        </DropdownTrigger>
        <DropdownBody className="flex flex-col gap-2 items-stretch w-70 mt-8">
          {data?.data.length === 0 && input !== "" && (
            <Typography className="p-2">No users found...</Typography>
          )}
          {!isEmptyInput &&
            data?.data.slice(0, 5).map((user) => (
              <SearchElement
                key={user.id}
                onClick={handleSubmit}
                search={{
                  content: user.name + " " + user.lastname,
                  avatarUrl: user.avatarUrl,
                  href: `/profile/${user.id}`,
                  type: "USER",
                }}
              />
            ))}
          {isEmptyInput && <RecentSearches />}
        </DropdownBody>
      </Dropdown>
    </form>
  );
}

export default SearchUsers;
