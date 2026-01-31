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
import { MdRemove, MdAdd, MdDelete, MdCancel } from "react-icons/md";

type GroupChatInfoProps = {
  groupChat: GroupChat;
};

function GroupChatInfo({ groupChat }: GroupChatInfoProps) {
  const { accessToken, user } = useAuth();
  const router = useRouter();
  const { socket } = useSocket();
  const removeFromChatMutation = useMutation({
    mutationFn: (userId: string) =>
      removeFromGroupChat(accessToken, groupChat.id, userId),
    onSuccess: (_, userId) => {
      router.push(`/chat/${groupChat.id}`);
      socket?.emit("groupchat-remove", {
        userId: userId,
        entityId: groupChat.id,
      });
    },
  });

  const addToChatMutation = useMutation({
    mutationFn: (userId: string) =>
      addMember(accessToken, groupChat.id, userId),
    onSuccess: (_, userId) => {
      router.push(`/chat/${groupChat.id}`);
      socket?.emit("groupchat-add", {
        userId: userId,
        entityId: groupChat.id,
      });
    },
  });

  const [friendSearch, setFriendSearch, debouncedFriendSearch] =
    useDebouncedState("");

  const friends = useQuery({
    queryFn: () =>
      getUserFriends(user?.id ?? "", accessToken, {
        search: debouncedFriendSearch,
      }),
    queryKey: ["addable-friends", debouncedFriendSearch],
  });

  const addableFriends = friends.data?.data.filter(
    (friend) => !groupChat.members.some((m) => m.id === friend.id),
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
        {groupChat.members.map((member) => (
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
                onClick={() => removeFromChatMutation.mutate(member.id)}
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
                onClick={() => addToChatMutation.mutate(friend.id)}
              >
                <MdAdd />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>
      <Button onClick={() => removeFromChatMutation.mutate(user?.id ?? "")}>
        Quit <MdCancel />
      </Button>
    </>
  );
}

export default GroupChatInfo;
