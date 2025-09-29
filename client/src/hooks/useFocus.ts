import { useEffect } from "react";
import { useToggle } from "./useToggle";

export function useFocus() {
  const { value, setTrue, setFalse } = useToggle(true);
  useEffect(() => {
    window.addEventListener("focus", setTrue);
    window.addEventListener("blur", setFalse);
    return () => {
      window.removeEventListener("focus", setTrue);
      window.removeEventListener("blur", setFalse);
    };
  }, [setTrue, setFalse]);

  return value;
}
