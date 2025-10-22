"use client";

import React from "react";
import { MdFavorite } from "react-icons/md";
import Button from "../ui/Button";

import { useLikePost } from "@/hooks/useLikePost";
import { Post } from "@/types/post";

function LikePostButton({
  likeCount,
  post,
  isLiked,
}: {
  likeCount: number;
  isLiked?: boolean;
  post: Post;
}) {
  const { handleLike, newLikeCount, value } = useLikePost({
    likeCount,
    post,
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
