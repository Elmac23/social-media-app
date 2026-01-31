"use client";

import { updateGroupChat } from "@/api/groupChats";
import { useAuth } from "@/components/AuthProvider";
import { queryClient } from "@/components/QueryProvider";
import Button from "@/components/ui/Button";
import FormControl from "@/components/ui/formControl";
import Input from "@/components/ui/formControl/Input";
import Label from "@/components/ui/formControl/Label";
import Textarea from "@/components/ui/formControl/Textarea";
import Typography from "@/components/ui/Typography";
import { GroupChat } from "@/types/groupChat";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { MdSave } from "react-icons/md";
import z from "zod";

const updateGroupChatSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export type UpdateGroupChatDto = z.infer<typeof updateGroupChatSchema>;

type GroupChatEditProps = {
  groupChat: GroupChat;
  onSuccess: () => void;
};

function GroupChatEdit({ groupChat, onSuccess }: GroupChatEditProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateGroupChatSchema),
    defaultValues: {
      description: groupChat.description,
      name: groupChat.name,
    },
  });

  const { accessToken } = useAuth();
  const router = useRouter();

  const editGroupMutation = useMutation({
    mutationKey: ["groupChat", groupChat.id],
    mutationFn: (data: UpdateGroupChatDto) =>
      updateGroupChat(accessToken, groupChat.id, data),
    onSuccess: () => {
      onSuccess();
      router.refresh();
    },
    onError: () => {
      alert("hjhkh");
    },
  });

  const onSubmitForm = handleSubmit((data) => editGroupMutation.mutate(data));
  return (
    <>
      <Typography center size="xl" bold>
        Edit Group Chat
      </Typography>
      <form onSubmit={onSubmitForm}>
        <FormControl error={errors.name?.message} className="mb-4">
          <Label>Name</Label>
          <Input {...register("name")} fullWidth />
        </FormControl>
        <FormControl error={errors.name?.message} className="mb-4">
          <Label>Description</Label>
          <Textarea {...register("description")} />
        </FormControl>
        <Button>
          Submit <MdSave />
        </Button>
      </form>
    </>
  );
}

export default GroupChatEdit;
