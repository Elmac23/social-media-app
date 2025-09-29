"use client";

import Button from "@/components/ui/Button";
import { useDeclineInvite } from "@/hooks/useDeclineInvite";
import React from "react";
import { MdCancel } from "react-icons/md";

type RemoveRequestButtonProps = React.ComponentProps<typeof Button> & {
  inviteId: string;
};

function DeclineInviteButton({ inviteId, ...props }: RemoveRequestButtonProps) {
  const { decline } = useDeclineInvite(inviteId);
  return <Button icon={<MdCancel />} onClick={() => decline()} {...props} />;
}

export default DeclineInviteButton;
