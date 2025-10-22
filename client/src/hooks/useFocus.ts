import { useEffect } from "react";
import { useToggle } from "./useToggle";

export function useFocus(el?: HTMLElement | null) {
  const { value, setTrue, setFalse } = useToggle(false);
  useEffect(() => {
    if (!el) return;
    el.addEventListener("focus", setTrue);
    el.addEventListener("blur", setFalse);
    return () => {
      el.removeEventListener("focus", setTrue);
      el.removeEventListener("blur", setFalse);
    };
  }, [setTrue, setFalse, el]);

  return value;
}
