"use client";

import Button from "@/components/ui/Button";
import { useDeleteFriend } from "@/hooks/useDeleteFriend";
import React from "react";
import { MdCancel } from "react-icons/md";

type RemoveFriendButtonProps = React.ComponentProps<typeof Button> & {
  yourId: string;
  friendId: string;
};
function RemoveFriendButton({
  friendId,
  yourId,
  ...props
}: RemoveFriendButtonProps) {
  const { remove } = useDeleteFriend(yourId, friendId);
  return <Button onClick={() => remove()} {...props} />;
}

export default RemoveFriendButton;
