import { declineInvite } from "@/api/friends";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useDeclineInvite(inviteId: string) {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: () => declineInvite(inviteId),
    onSuccess: () => {
      router.refresh();
    },
  });

  return { decline: mutate };
}
