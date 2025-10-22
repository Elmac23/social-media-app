import { useEffect } from "react";
import { useTimeout } from "./useTimeout";

export function useDebounce(
  cb: (...args: unknown[]) => unknown,
  delay: number = 1000,
  deps: unknown[] = []
) {
  const { clear, reset } = useTimeout(cb, delay);
  useEffect(reset, [...deps]);
  useEffect(clear, []);
}
