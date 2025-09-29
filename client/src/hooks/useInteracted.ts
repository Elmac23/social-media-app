import { useEffect } from "react";
import { useToggle } from "./useToggle";

export function useInterracted() {
  const { value, setTrue } = useToggle(false);
  useEffect(() => {
    window.addEventListener("click", setTrue);
    return () => {
      window.removeEventListener("click", setTrue);
    };
  }, [setTrue]);

  return value;
}
