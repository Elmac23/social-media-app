"use client";

import { useEffect, useRef, useState } from "react";
import { arrayOf } from "@/lib/arrayOf";
import Card from "./Card";
import { useCounter } from "@/hooks/useCounter";
import { cn } from "@/lib/cn";

type InputOTPProps = {
  length: number;
  onChange: (v: string) => void;
};

const ALLOWED_INPUT = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function InputOTP({ length, onChange }: InputOTPProps) {
  const [values, setValues] = useState<Array<string | null>>(
    arrayOf(length, null),
  );
  const [isFocused, setIsFocused] = useState(false);
  const selectedInputCounter = useCounter(0, length - 1, {
    initialValue: 0,
    isCarrousel: false,
  });

  useEffect(() => {
    onChange(values.join(""));
  }, [values, onChange]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isFocused) return;
      if (e.key === "ArrowRight") selectedInputCounter.increment();
      else if (e.key === "ArrowLeft") selectedInputCounter.decrement();
      else if (ALLOWED_INPUT.includes(e.key)) {
        const copy = [...values];
        copy[selectedInputCounter.value] = e.key;
        setValues(copy);
        selectedInputCounter.increment();
        if (selectedInputCounter.value === length - 1) setIsFocused(false);
      } else if (e.key === "Backspace" || e.key === "Delete") {
        if (values[selectedInputCounter.value] === null) return;
        const copy = [...values];
        copy.splice(selectedInputCounter.value, 1);
        copy.push(null);
        setValues(copy);
        selectedInputCounter.decrement();
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedInputCounter, values, isFocused, length]);

  return (
    <div
      className="flex gap-4 outline-0"
      tabIndex={0}
      onBlur={() => setIsFocused(false)}
    >
      {values.map((v, idx) => (
        <Card
          className={cn(
            "size-12 p-0 grid place-items-center cursor-pointer",
            idx === selectedInputCounter.value &&
              isFocused &&
              "outline-2 outline-primary-500 outline-solid outline-offset-2",
          )}
          key={idx}
          onClick={() => {
            selectedInputCounter.set(idx);
            setIsFocused(true);
          }}
        >
          {v}
        </Card>
      ))}
    </div>
  );
}

export default InputOTP;
