"use client";

import { acceptFriend } from "@/api/friends";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { MdPersonAdd } from "react-icons/md";

function AcceptFriendButton({ inviteId }: { inviteId: string }) {
  const { accessToken } = useAuth();
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: () => acceptFriend(inviteId || "", accessToken),
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <Button icon={<MdPersonAdd />} onClick={() => mutate()}>
      Accept
    </Button>
  );
}

export default AcceptFriendButton;
