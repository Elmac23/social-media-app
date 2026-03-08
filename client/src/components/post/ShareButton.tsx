"use client";

import React from "react";
import { MdShare } from "react-icons/md";
import Button from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { addRepost, deleteRepost } from "@/api/posts";
import { useAuth } from "../AuthProvider";
import { useRouter } from "next/navigation";
import { useSocket } from "../SocketProvider";
import { Post } from "@/types/post";

type ShareButtonProps = {
  post: Post;
  isSharedByMe?: boolean;
};

function ShareButton({ post, isSharedByMe }: ShareButtonProps) {
  const postId = post.id;
  const router = useRouter();
  const { socket } = useSocket();
  const { mutate: share } = useMutation({
    mutationFn: async () => addRepost(postId),
    onSuccess: () => {
      router.refresh();
      socket?.emit("share-post", { entityId: postId, userId: post.author.id });
    },
  });

  const { mutate: deleteShare } = useMutation({
    mutationFn: async () => deleteRepost(postId),
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <Button
      icon={<MdShare />}
      variant="ghost"
      className={isSharedByMe ? "text-primary-500" : ""}
      fullWidth
      center
      onClick={() => {
        if (isSharedByMe) {
          deleteShare();
        } else {
          share();
        }
      }}
    >
      {isSharedByMe ? "Unshare" : "Share"}
    </Button>
  );
}

export default ShareButton;
