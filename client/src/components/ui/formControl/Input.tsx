import { cn } from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { useFormControl } from ".";

const inputVariants = cva("p-2 w-full outline-none", {
  variants: {
    size: {
      small: "text-xs",
      medium: "text-base",
      large: "text-lg",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

function Input({
  size,
  fullWidth,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & {
  fullWidth?: boolean;
} & VariantProps<typeof inputVariants>) {
  const { id } = useFormControl();
  return (
    <div
      className={cn(
        "ring-2 block ring-primary-500 rounded-sm focus-within:ring-primary-400 hover:ring-primary-400 transition-all",
        fullWidth && "w-full"
      )}
    >
      <input
        {...props}
        id={id}
        className={cn(inputVariants({ size }), className)}
      />
      {children}
    </div>
  );
}

export default Input;
