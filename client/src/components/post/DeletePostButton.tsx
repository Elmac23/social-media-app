"use client";

import React from "react";
import { MdDelete } from "react-icons/md";
import Button from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { deletePost } from "@/api/posts";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const { mutate: deletePostMutation } = useMutation({
    mutationFn: async () => deletePost(postId),
    onSuccess: () => {
      router.refresh();
    },
  });

  const t = useTranslations("UserProfile.posts");

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
      {t("deletePost")}
    </Button>
  );
}

export default DeletePostButton;
