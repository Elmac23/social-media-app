"use client";

import { inviteFriend } from "@/api/friends";
import Button from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useSocket } from "../SocketProvider";
import { useTranslations } from "next-intl";

function AddFriendButton({ userId }: { userId: string }) {
  const { socket } = useSocket();
  const router = useRouter();
  const t = useTranslations("UserProfile.friends");
  const { mutate } = useMutation({
    mutationFn: () => inviteFriend(userId),
    onSuccess: () => {
      router.refresh();
      socket?.emit("invite-friend", { userId, entityId: userId });
    },
  });
  return <Button onClick={() => mutate()}>{t("addFriend")}</Button>;
}

export default AddFriendButton;
