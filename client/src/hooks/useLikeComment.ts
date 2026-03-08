import { likeComment, unlikeComment } from "@/api/comments";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useToggle } from "./useToggle";
import { useSocket } from "@/components/SocketProvider";
import { Comment } from "@/types/comment";

type UseLikePostProps = {
  likeCount: number;
  isLiked?: boolean;
  comment: Comment;
};

export function useLikeComment({
  comment,
  likeCount,
  isLiked,
}: UseLikePostProps) {
  const commentId = comment.id;
  const { socket } = useSocket();
  const { value, setFalse, setTrue } = useToggle(isLiked || false);
  const [newLikeCount, setNewLikeCount] = useState(likeCount);
  const { mutate: likeCommentMutation } = useMutation({
    mutationFn: async () => likeComment(commentId),
    onSuccess: () => {
      setTrue();
      setNewLikeCount((count) => count + 1);
      socket?.emit("like-comment", {
        userId: comment.authorId,
        entityId: comment.id,
      });
    },
    onError: () => {
      setFalse();
    },
  });

  const { mutate: unlikeCommentMutation } = useMutation({
    mutationFn: async () => unlikeComment(commentId),
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
