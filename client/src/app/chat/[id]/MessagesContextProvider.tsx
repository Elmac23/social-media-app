"use client";

import { getGroupChatsMessages } from "@/api/messages";
import { useAuth } from "@/components/AuthProvider";
import { queryClient } from "@/components/QueryProvider";
import { useSocket } from "@/components/SocketProvider";
import { Message } from "@/types/message";
import { User } from "@/types/user";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

type MessagesContext = {
  writtingList: User[];
  fetchNextPage: () => void;
  handleSendMessage: (
    a: string,
    fn: (...args: unknown[]) => unknown,
  ) => unknown;
  currentMessages: Message[];
  groupChatId: string;
  addCurrentMessage: (message: Message) => unknown;
  data: InfiniteData<Message[], unknown>;
};

const messagesContext = React.createContext<MessagesContext>({
  writtingList: [],
  fetchNextPage: () => {},
  handleSendMessage: (a, fn) => {},
  currentMessages: [],
  groupChatId: "",
  addCurrentMessage: (msg) => {},
  data: {} as InfiniteData<Message[], unknown>,
});

export const useMessagesContext = () => useContext(messagesContext);

type MessagesContextProviderProps = React.PropsWithChildren<{
  initialMessages: Message[];
  groupChatId: string;
}>;

function MessagesContextProvider({
  groupChatId,
  initialMessages,
  children,
}: MessagesContextProviderProps) {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [writtingList, setWrittingList] = useState<User[]>([]);

  const { data, fetchNextPage } = useInfiniteQuery<Message[], Error>({
    queryKey: ["messages", groupChatId],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 10 ? allPages.length + 1 : undefined,
    queryFn: async ({ pageParam }) => {
      const res = await getGroupChatsMessages(groupChatId, {
        limit: 10,
        page: pageParam as number,
      });
      return res.data;
    },
    initialData: {
      pageParams: [1],
      pages: [initialMessages],
    },
  });
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);

  const router = useRouter();

  function addCurrentMessage(message: Message) {
    queryClient.refetchQueries({
      queryKey: ["group-chats"],
    });
    if (message.groupChatId !== groupChatId) return;
    setCurrentMessages((prevMessages) => [
      ...prevMessages,
      {
        ...message,
        id: message.id || Math.random().toString(36).substring(2, 15),
      },
    ]);
  }

  useEffect(() => {
    if (!socket) return;

    function handleNewMessage(message: Message) {
      addCurrentMessage(message);
    }

    function handleStartWritting({
      user,
      groupChatId: socketGroupChatId,
    }: {
      user: User;
      groupChatId: string;
    }) {
      setWrittingList((prev) => {
        if (groupChatId !== socketGroupChatId) return prev;
        if (prev.find((u) => u.id === user.id)) return prev;
        return [...prev, user];
      });
    }

    function handleStopWritting({ user }: { user: User; groupChatId: string }) {
      setWrittingList((prev) => prev.filter((u) => u.id !== user.id));
    }

    function handleRemovedFromChat(chatId: string) {
      if (chatId === groupChatId) router.push("/chat");
    }
    socket.on("user-writting", handleStartWritting);
    socket.on("user-stopped-writting", handleStopWritting);
    socket.on("remove-from-groupchat", handleRemovedFromChat);
    socket.emit("user-stopped-writting", {
      groupChatId,
      userId: user?.id,
    });
    socket.on("new-message", handleNewMessage);
    socket.emit("join-all-rooms");
    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("user-writting", handleStartWritting);
      socket.off("user-stopped-writting", handleStopWritting);
      socket.off("remove-from-groupchat", handleRemovedFromChat);
      socket.emit("exit-all-rooms");
      socket.emit("user-stopped-writting", {
        groupChatId,
        userId: user?.id,
      });
    };
  }, [socket, groupChatId]);

  const handleSendMessage = (
    content: string,
    fn: (...args: unknown[]) => unknown,
  ) => {
    if (!socket) return;
    if (content.trim() === "") return;

    socket?.emit("send-message", {
      content,
      senderId: user?.id,
      createdAt: new Date().toISOString(),
      groupChatId,
    });
    setCurrentMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Math.random().toString(36).substring(2, 15),
        content,
        senderId: user!.id,
        sender: user!,
        type: "DEFAULT",
        groupChatId,
        createdAt: new Date().toISOString(),
      },
    ]);

    fn();
  };

  return (
    <messagesContext.Provider
      value={{
        groupChatId,
        currentMessages,
        addCurrentMessage,
        data,
        fetchNextPage,
        handleSendMessage,
        writtingList,
      }}
    >
      {children}
    </messagesContext.Provider>
  );
}

export default MessagesContextProvider;
