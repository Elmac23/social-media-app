import { removeFriend } from "@/api/friends";
import { useAuth } from "@/components/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useDeleteFriend(yourId: string, friendId: string) {
  const { accessToken } = useAuth();
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: () => removeFriend(yourId, friendId, accessToken),
    onSuccess: () => {
      router.refresh();
    },
  });

  return { remove: mutate };
}
