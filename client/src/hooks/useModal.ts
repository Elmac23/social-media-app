"use client";

import { useToggle } from "./useToggle";

export function useModal() {
  const { value: isOpen, setFalse: close, setTrue: open } = useToggle(false);

  return { isOpen, open, close };
}
