"use client";

import { likePost, unlikePost } from "@/api/posts";
import { useAuth } from "@/components/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useToggle } from "./useToggle";

type UseLikePostProps = {
  likeCount: number;
  isLiked?: boolean;
  postId: string;
};

export function useLikePost({ likeCount, postId, isLiked }: UseLikePostProps) {
  const { accessToken } = useAuth();
  const { value, setFalse, setTrue } = useToggle(isLiked || false);
  const [newLikeCount, setNewLikeCount] = useState(likeCount);
  const { mutate: likePostMutation } = useMutation({
    mutationFn: async () => likePost(postId, accessToken),
    onSuccess: () => {
      setTrue();
      setNewLikeCount((count) => count + 1);
    },
    onError: () => {
      setFalse();
      setNewLikeCount((count) => count - 1);
    },
  });

  const { mutate: unlikePostMutation } = useMutation({
    mutationFn: async () => unlikePost(postId, accessToken),
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
