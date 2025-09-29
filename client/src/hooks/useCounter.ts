import { useState } from "react";

export function useCounter(min: number, max: number, initialValue: number) {
  const [value, setValue] = useState(initialValue ?? min);

  const increment = () => {
    setValue((v) => (v >= max ? min : v + 1));
  };

  const decrement = () => {
    setValue((v) => (v <= min ? max : v - 1));
  };

  const reset = () => {
    setValue(0);
  };

  return {
    value,
    increment,
    decrement,
    reset,
  };
}
