"use client";

import React from "react";
import { MdDelete } from "react-icons/md";
import Button from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { deleteComment } from "@/api/comments";
import { queryClient } from "../QueryProvider";
import { useRouter } from "next/navigation";

function DeleteCommentButton({ commentId }: { commentId: string }) {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: async () => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      router.refresh();
    },
  });

  return (
    <Button
      icon={<MdDelete />}
      center
      fullWidth
      variant="ghost"
      onClick={() => mutate()}
    >
      Delete Comment
    </Button>
  );
}

export default DeleteCommentButton;
