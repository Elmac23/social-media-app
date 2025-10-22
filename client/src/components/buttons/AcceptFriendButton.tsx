"use client";

import { acceptFriend } from "@/api/friends";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { MdPersonAdd } from "react-icons/md";
import { useSocket } from "../SocketProvider";
import { ReceivedFriendIvite } from "@/types/friendRequest";

type AcceptFriendButtonProps = {
  invite: ReceivedFriendIvite;
};

function AcceptFriendButton({ invite }: AcceptFriendButtonProps) {
  const { id: inviteId } = invite;
  const { accessToken } = useAuth();
  const { socket } = useSocket();
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: () => acceptFriend(inviteId || "", accessToken),
    onSuccess: () => {
      router.refresh();
      socket?.emit("accept-friend", {
        userId: invite.sender.id,
        entityId: inviteId,
      });
    },
  });
  return (
    <Button icon={<MdPersonAdd />} onClick={() => mutate()}>
      Accept
    </Button>
  );
}

export default AcceptFriendButton;
