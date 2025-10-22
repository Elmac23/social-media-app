import { useState } from "react";
import { useDebounce } from "./useDebounce";

export function useDebouncedState<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue);
  const [input, setInput] = useState(initialValue);

  useDebounce(
    () => {
      setValue(input);
    },
    200,
    [input]
  );

  return [input, setInput, value] as const;
}
