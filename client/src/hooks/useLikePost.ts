"use client";

import { likePost, unlikePost } from "@/api/posts";
import { useAuth } from "@/components/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useToggle } from "./useToggle";
import { useSocket } from "@/components/SocketProvider";
import { Post } from "@/types/post";

type UseLikePostProps = {
  likeCount: number;
  isLiked?: boolean;
  post: Post;
};

export function useLikePost({ likeCount, post, isLiked }: UseLikePostProps) {
  const postId = post.id;
  const { socket } = useSocket();
  const { user } = useAuth();
  const { value, setFalse, setTrue } = useToggle(isLiked || false);
  const [newLikeCount, setNewLikeCount] = useState(likeCount);
  const { mutate: likePostMutation } = useMutation({
    mutationFn: async () => likePost(postId),
    onSuccess: () => {
      setTrue();
      setNewLikeCount((count) => count + 1);
      socket?.emit("like-post", {
        entityId: postId,
        senderId: user?.id,
        userId: post.author.id,
      });
    },
    onError: () => {
      setFalse();
      setNewLikeCount((count) => count - 1);
    },
  });

  const { mutate: unlikePostMutation } = useMutation({
    mutationFn: async () => unlikePost(postId),
    onSuccess: () => {
      setFalse();
      setNewLikeCount((count) => count - 1);
    },
    onError: () => {
      setTrue();
      setNewLikeCount((count) => count + 1);
    },
  });

  const handleLike = () => {
    if (value) {
      unlikePostMutation();
    } else {
      likePostMutation();
    }
  };

  return { value, newLikeCount, handleLike };
}
