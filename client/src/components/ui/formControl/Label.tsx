import { cn } from "@/lib/cn";
import React from "react";
import { useFormControl } from ".";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  const { id } = useFormControl();
  return (
    <label {...props} htmlFor={id} className={cn("mb-2 block", className)} />
  );
}

export default Label;
