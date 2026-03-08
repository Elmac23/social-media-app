"use client";

import { useAuth } from "@/components/AuthProvider";
import Input from "@/components/ui/formControl/Input";
import IconButton from "@/components/ui/IconButton";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { MdSend } from "react-icons/md";
import MessageComponent from "./Message";
import { motion, useInView } from "motion/react";
import { useSocket } from "@/components/SocketProvider";
import Typography from "@/components/ui/Typography";
import { useMessagesContext } from "./MessagesContextProvider";

type MessagesListProps = {
  children?: React.ReactNode;
};

function MessagesList({ children }: MessagesListProps) {
  const {
    currentMessages,
    data,
    fetchNextPage,
    handleSendMessage,
    writtingList,
    groupChatId,
  } = useMessagesContext();
  const { user } = useAuth();
  const { socket } = useSocket();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const previousHeightRef = useRef<number>(0);
  const loaderRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(loaderRef);
  const formInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
    return () => cancelAnimationFrame(id);
  }, [currentMessages]);

  return (
    <div className="flex flex-col h-full">
      {children}
      <div className="flex-1 overflow-auto" ref={scrollAreaRef}>
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
                )),
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
      {writtingList.length > 1 && (
        <Typography className="mt-2 px-4 py-1 rounded-lg bg-background">{`${writtingList[0].name} ${
          writtingList[0].lastname
        } and ${writtingList.length - 1} are writting...`}</Typography>
      )}
      {writtingList.length === 1 && (
        <Typography className="mt-2 px-4 py-1 rounded-lg bg-background">{`${writtingList[0].name} ${writtingList[0].lastname} is writting...`}</Typography>
      )}

      <form
        className="flex h-min mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(newMessage, () => {
            formInputRef.current?.blur();
            setNewMessage("");
          });
        }}
      >
        <Input
          ref={formInputRef}
          type="text"
          size="small"
          placeholder="Type your message..."
          fullWidth
          value={newMessage}
          onFocus={() =>
            socket?.emit("user-writting", {
              groupChatId,
              userId: user?.id,
            })
          }
          onBlur={() =>
            socket?.emit("user-stopped-writting", {
              groupChatId,
              userId: user?.id,
            })
          }
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
