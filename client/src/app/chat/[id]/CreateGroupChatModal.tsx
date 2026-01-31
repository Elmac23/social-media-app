"use client";

import { createGroupChat } from "@/api/groupChats";
import { useAuth } from "@/components/AuthProvider";
import { queryClient } from "@/components/QueryProvider";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import FormControl from "@/components/ui/formControl";
import FormError from "@/components/ui/formControl/FormError";
import Input from "@/components/ui/formControl/Input";
import Label from "@/components/ui/formControl/Label";
import Textarea from "@/components/ui/formControl/Textarea";
import IconButton from "@/components/ui/IconButton";
import List from "@/components/ui/List";
import ListItem from "@/components/ui/ListItem";
import Typography from "@/components/ui/Typography";
import { useSelectFriends } from "@/hooks/useSelectFriends";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import { CreateGroupChatDto, groupChatSchema } from "@/schema/groupChatSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { MdAdd, MdCreate, MdDelete } from "react-icons/md";

function CreateGroupChatModal() {
  const {
    formState: { errors, isSubmitted },
    register,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(groupChatSchema),
  });

  const { accessToken, user } = useAuth();

  const navigate = useRouter();

  const {
    notSelectedFriends,
    selectFriend,
    setFriendSearch,
    unSelectFriend,
    selectedFriends,
  } = useSelectFriends();

  const mutation = useMutation({
    mutationFn: (data: CreateGroupChatDto) => {
      const memberIds = selectedFriends.map((u) => u.id);
      memberIds.push(user?.id ?? "");
      return createGroupChat(accessToken, {
        ...data,
        memberIds,
        type: "GROUP",
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      navigate.push(`/chat/${res.data.id}`);
    },
  });

  const onSubmit = handleSubmit((data) => mutation.mutate(data));
  return (
    <div>
      <Typography as="h3" size="xl" bold className="mb-4">
        Create group chat
      </Typography>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormControl error={errors.name?.message}>
          <Label>Group Name</Label>
          <Input fullWidth {...register("name")} />
          <FormError />
        </FormControl>

        <FormControl error={errors.description?.message}>
          <Label>Description</Label>
          <Textarea rows={4} className="h-24" {...register("description")} />
          <FormError />
        </FormControl>
        <Typography>Selected users:</Typography>
        <List className="max-h-64 overflow-y-scroll" variant="ul">
          {selectedFriends.map((friend) => (
            <ListItem key={friend.id}>
              <Avatar
                alt={friend.login}
                url={getAvatarUrl(friend.avatarUrl)}
                className="mr-2"
              />
              {friend.name} {friend.lastname}
              <IconButton
                variant="ghost"
                onClick={() => unSelectFriend(friend)}
                type="button"
              >
                <MdDelete />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Typography>Add users:</Typography>
        <Input
          onChange={(e) => setFriendSearch(e.currentTarget.value)}
          fullWidth
        />
        <List variant="ul" className="max-h-64 overflow-y-scroll">
          {notSelectedFriends.map((friend) => (
            <ListItem key={friend.id}>
              <Avatar
                alt={friend.login}
                url={getAvatarUrl(friend.avatarUrl)}
                className="mr-2"
              />
              {friend.name} {friend.lastname}
              <IconButton
                variant="ghost"
                onClick={() => selectFriend(friend)}
                type="button"
                className="ml-4"
              >
                <MdAdd />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <FormError>
          {selectedFriends.length === 0 &&
            isSubmitted &&
            "You have to add at least 1 friend!"}
        </FormError>
        <Button icon={<MdCreate />}>Create group</Button>
      </form>
    </div>
  );
}

export default CreateGroupChatModal;
