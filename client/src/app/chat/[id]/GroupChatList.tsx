"use client";

import { useAuth } from "@/components/AuthProvider";

import { GroupChat } from "@/types/groupChat";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import GroupChatComponent from "./GroupChat";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUsersGroupChats } from "@/api/groupChats";
import Input from "@/components/ui/formControl/Input";
import { useInView } from "motion/react";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import FormControl from "@/components/ui/formControl";
import Label from "@/components/ui/formControl/Label";
import Typography from "@/components/ui/Typography";
import { useSocket } from "@/components/SocketProvider";
import IconButton from "@/components/ui/IconButton";
import { MdAdd } from "react-icons/md";
import Modal from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import CreateGroupChatModal from "./CreateGroupChatModal";
import { queryClient } from "@/components/QueryProvider";

type GroupChatListProps = {
  groupChats: GroupChat[];
};

function GroupChatList({ groupChats }: GroupChatListProps) {
  const { id } = useParams();
  const { close, isOpen, open } = useModal();

  const { user } = useAuth();
  const [value, setValue, search] = useDebouncedState("");
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
      const res = await getUsersGroupChats(user?.id || "", {
        limit: 10,
        page: pageParam as number,
        search,
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 10 ? allPages.length + 1 : undefined,
  });

  const [newGroupChats, setNewGroupChats] = useState<GroupChat[]>([]);

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    function handleNewMessage() {
      if (search) return;
      queryClient.invalidateQueries({
        queryKey: ["group-chats"],
      });
    }

    function handleAddedToChat() {
      queryClient.invalidateQueries();
    }

    function handleRemovedFromChat() {
      queryClient.invalidateQueries();
    }

    socket.on("added-to-groupchat", handleAddedToChat);

    socket.on("remove-from-groupchat", handleRemovedFromChat);

    socket.emit("join-all-rooms");
    socket.on("new-message", handleNewMessage);
    socket.on("self-chat-top", handleNewMessage);
    return () => {
      socket.emit("exit-all-rooms");
      socket.off("new-message", handleNewMessage);
      socket.off("self-chat-top", handleNewMessage);
      socket.off("added-to-groupchat", handleAddedToChat);
      socket.off("remove-from-groupchat", handleRemovedFromChat);
    };
  }, [socket]);

  useEffect(() => {
    if (data) {
      const all = data.pages.flat();
      const map = new Map<string, GroupChat>();
      for (const chat of all) {
        if (!map.has(chat.id)) map.set(chat.id, chat);
      }
      setNewGroupChats(Array.from(map.values()));
    }
  }, [data]);
  useEffect(() => {
    if (isBottomVisible) fetchNextPage();
  }, [isBottomVisible, fetchNextPage]);

  return (
    <div className="pr-4 grid gap-4 grid-rows-[min-content_1fr] w-80">
      <div>
        <FormControl>
          <Label>Search Chat</Label>
          <Input
            maxLength={40}
            fullWidth
            value={value}
            onInput={(e) => setValue(e.currentTarget.value)}
            placeholder="John Doe"
          />
        </FormControl>
      </div>
      <ul className="overflow-y-auto">
        {newGroupChats.length === 0 && (
          <Typography color="muted">No chats found.</Typography>
        )}
        {newGroupChats.length > 0 &&
          newGroupChats.map((chat) => (
            <GroupChatComponent
              key={chat.id + Math.random()}
              groupChat={chat}
              activeGroupChatId={id as string}
              userId={user?.id || ""}
              currentSearch={search}
            />
          ))}
        <div ref={bottomRef}></div>
      </ul>
      <Modal isOpen={isOpen} onClose={close}>
        <CreateGroupChatModal />
      </Modal>
      <IconButton className="justify-self-start" size="large" onClick={open}>
        <MdAdd />
      </IconButton>
    </div>
  );
}

export default GroupChatList;
