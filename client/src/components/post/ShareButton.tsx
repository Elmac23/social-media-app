"use client";

import React from "react";
import { MdShare } from "react-icons/md";
import Button from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { addRepost, deleteRepost } from "@/api/posts";
import { useAuth } from "../AuthProvider";
import { useRouter } from "next/navigation";

type ShareButtonProps = {
  postId: string;
  isSharedByMe?: boolean;
};

function ShareButton({ postId, isSharedByMe }: ShareButtonProps) {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { mutate: share } = useMutation({
    mutationFn: async () => addRepost(postId, accessToken),
    onSuccess: () => {
      router.refresh();
    },
  });

  const { mutate: deleteShare } = useMutation({
    mutationFn: async () => deleteRepost(postId, accessToken),
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
