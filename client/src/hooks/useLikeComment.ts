import { likeComment, unlikeComment } from "@/api/comments";
import { useAuth } from "@/components/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useToggle } from "./useToggle";

type UseLikePostProps = {
  likeCount: number;
  isLiked?: boolean;
  commentId: string;
};

export function useLikeComment({
  commentId,
  likeCount,
  isLiked,
}: UseLikePostProps) {
  const { accessToken } = useAuth();
  const { value, setFalse, setTrue } = useToggle(isLiked || false);
  const [newLikeCount, setNewLikeCount] = useState(likeCount);
  const { mutate: likeCommentMutation } = useMutation({
    mutationFn: async () => likeComment(commentId, accessToken),
    onSuccess: () => {
      setTrue();
      setNewLikeCount((count) => count + 1);
    },
    onError: () => {
      setFalse();
    },
  });

  const { mutate: unlikeCommentMutation } = useMutation({
    mutationFn: async () => unlikeComment(commentId, accessToken),
    onSuccess: () => {
      setFalse();
      setNewLikeCount((count) => count - 1);
    },
    onError: () => {
      setTrue();
    },
  });

  const handleLike = () => {
    if (value) {
      unlikeCommentMutation();
    } else {
      likeCommentMutation();
    }
  };

  return { value, newLikeCount, handleLike };
}
