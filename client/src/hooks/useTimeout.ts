import { useEffect, useRef } from "react";

export function useTimeout(cb: () => unknown, delay: number = 1000) {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutId.current = setTimeout(() => {
      cb();
    }, delay);

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return {
    clear: () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    },
    reset: () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      timeoutId.current = setTimeout(() => {
        cb();
      }, delay);
    },
  };
}
