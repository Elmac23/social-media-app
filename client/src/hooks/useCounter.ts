import { useState } from "react";

type Config = {
  initialValue: number;
  isCarrousel: boolean;
};

export function useCounter(
  min: number,
  max: number,
  config: Config = {
    initialValue: min,
    isCarrousel: true,
  },
) {
  const { initialValue, isCarrousel } = config;
  const [value, setValue] = useState(initialValue ?? min);

  const increment = () => {
    if (isCarrousel) setValue((v) => (v >= max ? min : v + 1));
    else setValue((v) => (v >= max ? max : v + 1));
  };

  const decrement = () => {
    if (isCarrousel) setValue((v) => (v <= min ? max : v - 1));
    else setValue((v) => (v <= min ? min : v - 1));
  };

  const set = (num: number) => {
    setValue(num);
  };

  const reset = () => {
    setValue(0);
  };

  return {
    value,
    increment,
    decrement,
    reset,
    set,
  };
}
