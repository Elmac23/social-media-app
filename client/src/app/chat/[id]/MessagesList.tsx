"use client";

import { useAuth } from "@/components/AuthProvider";
import Input from "@/components/ui/formControl/Input";
import IconButton from "@/components/ui/IconButton";
import type { Message } from "@/types/message";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { MdSend } from "react-icons/md";
import MessageComponent from "./Message";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getGroupChatsMessages } from "@/api/messages";
import Button from "@/components/ui/Button";
import { motion, useInView } from "motion/react";
import { useSocket } from "@/components/SocketProvider";

type MessagesListProps = {
  initialMessages: Message[];
  groupChatId: string;
};

function MessagesList({ initialMessages, groupChatId }: MessagesListProps) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const previousHeightRef = useRef<number>(0);
  const loaderRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(loaderRef);

  const { data, fetchNextPage } = useInfiniteQuery<Message[], Error>({
    queryKey: ["messages", groupChatId],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 10 ? allPages.length + 1 : undefined,
    queryFn: async ({ pageParam }) => {
      const res = await getGroupChatsMessages(
        user?.accessToken || "",
        groupChatId,
        {
          limit: 10,
          page: pageParam as number,
        }
      );
      return res.data;
    },
    initialData: {
      pageParams: [1],
      pages: [initialMessages],
    },
  });
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const handleLoadMore = useCallback(() => {
    if (!scrollAreaRef.current) return;
    scrollPositionRef.current = scrollAreaRef.current.scrollTop;
    previousHeightRef.current = scrollAreaRef.current.scrollHeight;
    fetchNextPage();
  }, [fetchNextPage]);

  useEffect(() => {
    if (isInView) handleLoadMore();
  }, [isInView, handleLoadMore]);

  useLayoutEffect(() => {
    if (!scrollAreaRef.current) return;

    scrollAreaRef.current.scrollTop = 100000;
  }, []);

  useEffect(() => {
    if (!scrollAreaRef.current) return;

    const currentScroll = scrollAreaRef.current.scrollTop;
    const newHeight = scrollAreaRef.current.scrollHeight;
    const previousHeight = previousHeightRef.current;
    if (scrollPositionRef.current < 100 && previousHeight > 0) {
      const heightDifference = newHeight - previousHeight;
      scrollAreaRef.current.scrollTop = currentScroll + heightDifference;
    }
  }, [data?.pages]);

  React.useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
    return () => cancelAnimationFrame(id);
  }, [currentMessages]);

  useEffect(() => {
    if (!socket) return;

    function handleNewMessage(message: Message) {
      setCurrentMessages((prevMessages) => [
        ...prevMessages,
        {
          ...message,
          id: message.id || Math.random().toString(36).substring(2, 15),
        },
      ]);
    }
    socket.on("new-message", handleNewMessage);
    socket.emit("join-room", { groupChatId });

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.emit("exit-room", { groupChatId });
    };
  }, [socket, groupChatId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket) return;
    if (newMessage.trim() === "") return;

    socket?.emit("send-message", {
      content: newMessage,
      senderId: user?.id,
      createdAt: new Date().toISOString(),
      groupChatId,
    });
    setCurrentMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Math.random().toString(36).substring(2, 15),
        content: newMessage,
        senderId: user!.id,
        sender: user!,
        groupChatId,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewMessage("");
  };

  return (
    <div className="grid h-full">
      <div className="overflow-auto mb-4" ref={scrollAreaRef}>
        <motion.div ref={loaderRef}></motion.div>
        <ul className="pr-4 space-y-4">
          {data?.pages
            .toReversed()
            .map((page) =>
              page
                .toReversed()
                .map((message) => (
                  <MessageComponent
                    key={message.id}
                    message={message}
                    isYourMessage={message.senderId === user?.id}
                  />
                ))
            )}
          {currentMessages?.map((message) => {
            return (
              <MessageComponent
                key={message.id}
                message={message}
                isYourMessage={message.senderId === user?.id}
              />
            );
          })}
        </ul>
      </div>
      <form className="flex h-min self-end" onSubmit={handleSendMessage}>
        <Input
          type="text"
          placeholder="Type your message..."
          fullWidth
          value={newMessage}
          onInput={(e) => setNewMessage(e.currentTarget.value)}
        />

        <IconButton
          type="submit"
          className="rounded-none ring-2 ring-primary-500 rounded-r-sm"
        >
          <MdSend />
        </IconButton>
      </form>
    </div>
  );
}

export default MessagesList;
