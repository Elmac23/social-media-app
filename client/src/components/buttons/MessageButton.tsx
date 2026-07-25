"use client";

import Button from "../ui/Button";
import ButtonLink from "../ui/ButtonLink";
import { createGroupChat } from "@/api/groupChats";
import { CreateGroupChat } from "@/types/groupChat";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../AuthProvider";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type MessageButtonProps = {
  chatId?: string;
  recipentId?: string;
};

function MessageButton({ chatId, recipentId }: MessageButtonProps) {
  const { user } = useAuth();

  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: (data: CreateGroupChat) => createGroupChat(data),
    onSuccess: (data) => {
      router.push(`/chat/${data.id}`);
    },
  });

  const t = useTranslations("UserProfile.friends");

  if (chatId) {
    return <ButtonLink href={`/chat/${chatId}`}> {t("message")}</ButtonLink>;
  }

  if (!user) {
    return null;
  }

  if (!recipentId) {
    throw new Error("RecipentId or chatId must be provided");
  }

  return (
    <Button
      onClick={() =>
        mutate({
          memberIds: [user?.id, recipentId],
          type: "DIRECT",
        })
      }
    >
      {t("message")}
    </Button>
  );
}

export default MessageButton;
