"use client";

import React from "react";
import Button from "../ui/Button";
import { useLikeComment } from "@/hooks/useLikeComment";
import { Comment } from "@/types/comment";

function LikeCommentButton({
  likeCount,
  comment,
  isLiked,
}: {
  likeCount: number;
  isLiked?: boolean;
  comment: Comment;
}) {
  const { handleLike, newLikeCount, value } = useLikeComment({
    likeCount,
    comment,
    isLiked,
  });
  return (
    <Button
      className={value ? "text-primary-500" : ""}
      variant="link"
      size="small"
      center
      onClick={handleLike}
    >
      Like ({newLikeCount || 0})
    </Button>
  );
}

export default LikeCommentButton;
