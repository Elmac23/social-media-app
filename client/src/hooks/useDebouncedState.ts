import { useState } from "react";
import { useDebounce } from "./useDebounce";

export function useDebouncedState<T>(initialValue: T) {
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [input, setInput] = useState(initialValue);

  useDebounce(
    () => {
      setDebouncedValue(input);
    },
    200,
    [input],
  );

  return [input, setInput, debouncedValue] as const;
}
