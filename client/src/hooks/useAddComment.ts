"use client";

import { createComment } from "@/api/comments";
import { useAuth } from "@/components/AuthProvider";
import { queryClient } from "@/components/QueryProvider";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

type UseAddCommentProps = {
  parentCommentId?: string;
  postId: string;
};

export function useAddComment({ parentCommentId, postId }: UseAddCommentProps) {
  const [message, setMessage] = React.useState("");
  const { accessToken } = useAuth();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: (message: string) =>
      createComment({ content: message, parentCommentId, postId }, accessToken),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      router.refresh();
      setMessage("");
    },
  });

  return { message, setMessage, mutate };
}
