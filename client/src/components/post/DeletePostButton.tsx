"use client";

import React from "react";
import { MdDelete } from "react-icons/md";
import Button from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { deletePost } from "@/api/posts";
import { useAuth } from "../AuthProvider";
import { useRouter } from "next/navigation";

function DeletePostButton({ postId }: { postId: string }) {
  const { accessToken } = useAuth();
  const router = useRouter();
  const { mutate: deletePostMutation } = useMutation({
    mutationFn: async () => deletePost(postId, accessToken),
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Button
      icon={<MdDelete />}
      variant="ghost"
      fullWidth
      center
      onClick={() => {
        deletePostMutation();
      }}
    >
      Delete Post
    </Button>
  );
}

export default DeletePostButton;
