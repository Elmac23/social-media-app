"use client";

import { logout } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  return mutate;
}
