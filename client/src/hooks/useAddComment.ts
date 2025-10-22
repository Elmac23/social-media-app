"use client";

import { createComment } from "@/api/comments";
import { useAuth } from "@/components/AuthProvider";
import { useCommentContext } from "@/components/post/PostBottom";
import { queryClient } from "@/components/QueryProvider";
import { useSocket } from "@/components/SocketProvider";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

type UseAddCommentProps = {
  parentCommentId?: string;
  parentCommentAuthorId?: string;
};

export function useAddComment({
  parentCommentId,
  parentCommentAuthorId,
}: UseAddCommentProps) {
  const [message, setMessage] = React.useState("");
  const { socket } = useSocket();
  const { accessToken } = useAuth();
  const router = useRouter();
  const { post } = useCommentContext();

  const { mutate } = useMutation({
    mutationFn: (message: string) =>
      createComment(
        { content: message, parentCommentId, postId: post.id },
        accessToken
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      router.refresh();
      setMessage("");

      if (parentCommentAuthorId === post.author.id) {
        socket?.emit("respond-comment", {
          entityId: parentCommentId,
          userId: parentCommentAuthorId,
        });
      } else if (parentCommentAuthorId && post.author.id) {
        socket?.emit("respond-comment", {
          entityId: parentCommentId,
          userId: parentCommentAuthorId,
        });
        socket?.emit("comment-post", {
          entityId: post.id,
          userId: post.author.id,
        });
      } else {
        socket?.emit("comment-post", {
          entityId: post.id,
          userId: post.author.id,
        });
      }
    },
  });

  return { message, setMessage, mutate };
}

// respond-comment
// comment-post
