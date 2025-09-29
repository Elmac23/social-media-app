"use client";

import { follow, unfollow } from "@/api/followers";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/ui/Button";
import { useToggle } from "@/hooks/useToggle";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

type FollowButtonProps = {
  initialIsFollowing?: boolean;
  userId: string;
};

function FollowButton({ userId, initialIsFollowing }: FollowButtonProps) {
  const {
    setFalse: setNotFollow,
    setTrue: setFollow,
    value: isFollowing,
  } = useToggle(initialIsFollowing);

  const router = useRouter();

  const { accessToken } = useAuth();

  const { mutate: followMutation } = useMutation({
    mutationFn: () => follow(userId, accessToken),
    onSuccess: () => {
      router.refresh();
      setFollow();
    },
  });

  const { mutate: unfollowMutation } = useMutation({
    mutationFn: () => unfollow(userId, accessToken),
    onSuccess: () => {
      router.refresh();
      setNotFollow();
    },
  });

  return (
    <Button
      variant={isFollowing ? "outline" : "primary"}
      onClick={() => {
        if (isFollowing) {
          unfollowMutation();
        } else {
          followMutation();
        }
      }}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}

export default FollowButton;
