"use client";

import { follow, unfollow } from "@/api/followers";

import Button from "@/components/ui/Button";
import { useToggle } from "@/hooks/useToggle";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useSocket } from "../SocketProvider";
import { useTranslations } from "next-intl";

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

  const { socket } = useSocket();

  const { mutate: followMutation } = useMutation({
    mutationFn: () => follow(userId),
    onSuccess: () => {
      router.refresh();
      setFollow();
      socket?.emit("follow-user", { userId, entityId: userId });
    },
  });

  const { mutate: unfollowMutation } = useMutation({
    mutationFn: () => unfollow(userId),
    onSuccess: () => {
      router.refresh();
      setNotFollow();
    },
  });

  const t = useTranslations("UserProfile.friends");

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
      {isFollowing ? t("unfollow") : t("follow")}
    </Button>
  );
}

export default FollowButton;
