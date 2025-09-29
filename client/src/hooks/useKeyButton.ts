"use client";

import { useEffect, useRef } from "react";

export type KeyDownOptions = {
  canHold: boolean;
};

export function useKeyButton(
  key: string | string[],
  cb: () => unknown,
  options: KeyDownOptions = {
    canHold: false,
  }
) {
  const isHeld = useRef(false);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isHeld.current && !options.canHold) {
        return;
      }
      if ((Array.isArray(key) && key.includes(e.key)) || key === e.key) {
        isHeld.current = true;
        return cb();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if ((Array.isArray(key) && key.includes(e.key)) || key === e.key) {
        isHeld.current = false;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [key, cb, options.canHold]);
}
