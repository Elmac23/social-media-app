"use client";

import { inviteFriend } from "@/api/friends";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

function AddFriendButton({ userId }: { userId: string }) {
  const { accessToken } = useAuth();
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: () => inviteFriend(accessToken, userId),
    onSuccess: () => {
      router.refresh();
    },
  });
  return <Button onClick={() => mutate()}>Add friend</Button>;
}

export default AddFriendButton;
