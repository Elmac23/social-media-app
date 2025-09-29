import { declineInvite } from "@/api/friends";
import { useAuth } from "@/components/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useDeclineInvite(inviteId: string) {
  const { accessToken } = useAuth();
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: () => declineInvite(accessToken, inviteId),
    onSuccess: () => {
      router.refresh();
    },
  });

  return { decline: mutate };
}
