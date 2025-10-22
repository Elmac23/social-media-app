"use client";

import { useAuth } from "@/components/AuthProvider";

import { GroupChat } from "@/types/groupChat";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import GroupChatComponent from "./GroupChat";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUsersGroupChats } from "@/api/groupChats";
import Input from "@/components/ui/formControl/Input";
import { useInView } from "motion/react";
import { useDebouncedState } from "@/hooks/useDebouncedState";

type GroupChatListProps = {
  groupChats: GroupChat[];
};

function GroupChatList({ groupChats }: GroupChatListProps) {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const { user } = useAuth();
  const [value, setValue, search] = useDebouncedState(
    searchParams.get("search") || ""
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const isBottomVisible = useInView(bottomRef);

  const { data, fetchNextPage } = useInfiniteQuery<GroupChat[], Error>({
    initialPageParam: 1,
    initialData: {
      pageParams: [1],
      pages: [groupChats],
    },
    queryKey: ["group-chats", search],
    queryFn: async ({ pageParam }) => {
      const res = await getUsersGroupChats(
        user?.accessToken || "",
        user?.id || "",
        {
          limit: 10,
          page: pageParam as number,
          search,
        }
      );
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 10 ? allPages.length + 1 : undefined,
  });

  useEffect(() => {
    if (isBottomVisible) fetchNextPage();
  }, [isBottomVisible, fetchNextPage]);

  return (
    <div className="pr-4 grid gap-4 grid-rows-[min-content_1fr] w-80">
      <div>
        <Input
          maxLength={40}
          fullWidth
          value={value}
          onInput={(e) => setValue(e.currentTarget.value)}
        />
      </div>
      <ul className="overflow-y-auto">
        {data.pages.map((page) =>
          page.map((chat) => (
            <GroupChatComponent
              key={chat.id}
              groupChat={chat}
              activeGroupChatId={id as string}
              userId={user?.id || ""}
              currentSearch={search}
            />
          ))
        )}
        <div ref={bottomRef}></div>
      </ul>
    </div>
  );
}

export default GroupChatList;
