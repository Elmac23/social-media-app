import { getUserFriends } from "@/api/friends";
import { useAuth } from "@/components/AuthProvider";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedState } from "./useDebouncedState";

export function useSelectFriends() {
  const { user } = useAuth();
  const [_, setFriendSearch, debouncedFriendSearch] = useDebouncedState("");

  const [selectedFriends, setSelectedFriends] = useState<User[]>([]);

  const friends = useQuery({
    queryFn: () =>
      getUserFriends(user.id, {
        search: debouncedFriendSearch,
      }),
    queryKey: ["friends", debouncedFriendSearch],
  });

  const selectFriend = (user: User) => {
    setSelectedFriends((v) => [...v, user]);
  };

  const unSelectFriend = (user: User) => {
    setSelectedFriends(
      selectedFriends.filter((friend) => friend.id !== user.id),
    );
  };

  const notSelectedFriends = friends.data
    ? friends.data.data.filter((friend) =>
        selectedFriends.every(
          (selectedFriend) => selectedFriend.id != friend.id,
        ),
      )
    : [];

  return {
    notSelectedFriends,
    selectFriend,
    unSelectFriend,
    setFriendSearch,
    selectedFriends,
  };
}
