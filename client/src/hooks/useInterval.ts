import { useEffect } from "react";
import { useToggle } from "./useToggle";

export function useInterval(
  cb: () => unknown,
  intervalTime: number,
  dependencies: any[] = [],
  isInstant: boolean = true
) {
  const { setFalse, setTrue, value } = useToggle(isInstant);
  useEffect(() => {
    if (value) {
      const intervalId = setInterval(() => {
        cb();
      }, intervalTime);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [value, ...dependencies]);

  return [setTrue, setFalse];
}
