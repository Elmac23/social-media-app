"use client";

import { logout } from "@/api/auth";
import { useAuth } from "@/components/AuthProvider";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  const { accessToken } = useAuth();
  const { mutate } = useMutation({
    mutationFn: (accessToken: string) => logout(accessToken),
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  return () => mutate(accessToken);
}
