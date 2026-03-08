import { getUserFriends } from "@/api/friends";
import { removeFromGroupChat, addMember } from "@/api/groupChats";
import { useAuth } from "@/components/AuthProvider";
import { useSocket } from "@/components/SocketProvider";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/formControl/Input";
import IconButton from "@/components/ui/IconButton";
import List from "@/components/ui/List";
import ListItem from "@/components/ui/ListItem";
import Typography from "@/components/ui/Typography";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import { GroupChat } from "@/types/groupChat";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { MdRemove, MdAdd, MdCancel } from "react-icons/md";
import { useMessagesContext } from "./MessagesContextProvider";
import { User } from "@/types/user";

type GroupChatInfoProps = {
  groupChat: GroupChat;
};

function GroupChatInfo({ groupChat }: GroupChatInfoProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { socket } = useSocket();
  const removeFromChatMutation = useMutation({
    mutationFn: (recipent: User) =>
      removeFromGroupChat(groupChat.id, recipent.id),
    onSuccess: (_, recipent) => {
      router.push(`/chat/${groupChat.id}`);
      socket?.emit("groupchat-remove", {
        userId: recipent.id,
        entityId: groupChat.id,
      });
      addCurrentMessage({
        content: `${recipent?.name} ${recipent?.lastname}`,
        createdAt: new Date().toISOString(),
        groupChatId: groupChat.id,
        id: Math.random().toString(36).substring(2, 15),
        senderId: "",
        type: "SYSTEM_REMOVE_USER",
        sender: user!,
      });
    },
  });

  const { addCurrentMessage } = useMessagesContext();

  const addToChatMutation = useMutation({
    mutationFn: (recipent: User) => addMember(groupChat.id, recipent.id),
    onSuccess: (_, recipent) => {
      router.push(`/chat/${groupChat.id}`);
      socket?.emit("groupchat-add", {
        userId: recipent.id,
        entityId: groupChat.id,
      });
      addCurrentMessage({
        content: `${recipent?.name} ${recipent?.lastname}`,
        createdAt: new Date().toISOString(),
        groupChatId: groupChat.id,
        id: Math.random().toString(36).substring(2, 15),
        senderId: "",
        type: "SYSTEM_ADD_USER",
        sender: user!,
      });
    },
  });

  const [friendSearch, setFriendSearch, debouncedFriendSearch] =
    useDebouncedState("");

  const friends = useQuery({
    queryFn: () =>
      getUserFriends(user.id, {
        search: debouncedFriendSearch,
      }),
    queryKey: ["addable-friends", debouncedFriendSearch],
  });

  const addableFriends = friends.data?.data?.filter(
    (friend) => !groupChat.members?.some((m) => m.id === friend.id),
  );
  return (
    <>
      <Typography size="xl" as="h3" bold center className="mb-4">
        {groupChat.name}
      </Typography>
      <Typography className="mb-2">{groupChat.description}</Typography>

      <Typography size="lg" as="h4" className="mb-2">
        Members:
      </Typography>

      <List variant="ul" className="max-h-96 overflow-y-scroll mb-4">
        {groupChat.members?.map((member) => (
          <ListItem key={member.id}>
            <Avatar
              alt={member.login}
              url={getAvatarUrl(member.avatarUrl)}
              className="mr-2"
            />
            {member.name}
            {member.id !== user?.id && (
              <IconButton
                variant="ghost"
                className="ml-auto"
                onClick={() => removeFromChatMutation.mutate(member)}
              >
                <MdRemove />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>

      <Typography size="lg" as="h4" className="mb-2">
        Add friends:
      </Typography>

      <Input
        fullWidth
        value={friendSearch}
        onInput={(e) => setFriendSearch(e.currentTarget.value)}
      />

      <List variant="ul" className="max-h-96 overflow-y-scroll my-4">
        {addableFriends?.map((friend) => (
          <ListItem key={friend.id}>
            <Avatar
              alt={friend.login}
              url={getAvatarUrl(friend.avatarUrl)}
              className="mr-2"
            />
            {friend.name}
            {friend.id !== user?.id && (
              <IconButton
                variant="ghost"
                className="ml-auto"
                onClick={() => addToChatMutation.mutate(friend)}
              >
                <MdAdd />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>
      <Button onClick={() => removeFromChatMutation.mutate(user)}>
        Quit <MdCancel />
      </Button>
    </>
  );
}

export default GroupChatInfo;
