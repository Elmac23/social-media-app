"use client";

import React from "react";
import { MdFavorite } from "react-icons/md";
import Button from "../ui/Button";

import { useLikePost } from "@/hooks/useLikePost";

function LikePostButton({
  likeCount,
  postId,
  isLiked,
}: {
  likeCount: number;
  isLiked?: boolean;
  postId: string;
}) {
  const { handleLike, newLikeCount, value } = useLikePost({
    likeCount,
    postId,
    isLiked,
  });
  return (
    <Button
      icon={<MdFavorite />}
      className={value ? "text-primary-500" : ""}
      variant="ghost"
      fullWidth
      center
      onClick={handleLike}
    >
      Like ({newLikeCount || 0})
    </Button>
  );
}

export default LikePostButton;
