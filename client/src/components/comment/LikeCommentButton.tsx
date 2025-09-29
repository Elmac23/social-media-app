"use client";

import React from "react";
import Button from "../ui/Button";
import { useLikeComment } from "@/hooks/useLikeComment";

function LikeCommentButton({
  likeCount,
  commentId,
  isLiked,
}: {
  likeCount: number;
  isLiked?: boolean;
  commentId: string;
}) {
  const { handleLike, newLikeCount, value } = useLikeComment({
    likeCount,
    commentId,
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
