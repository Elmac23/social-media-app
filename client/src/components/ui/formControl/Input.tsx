"use client";

import { cn } from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { useId } from "react";
import { useFormControl } from ".";
import IconButton from "../IconButton";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useToggle } from "@/hooks/useToggle";

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

type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  fullWidth?: boolean;
} & VariantProps<typeof inputVariants>;

function Input({ size, fullWidth, className, children, ...props }: InputProps) {
  const { id } = useFormControl();
  const defaultId = useId();
  const isPassword = props.type === "password";
  const { value: isPasswordVisible, toggle } = useToggle(false);
  return (
    <div
      className={cn(
        "ring-2 inline-block relative ring-primary-500 rounded-sm focus-within:ring-primary-400 hover:ring-primary-400 transition-all",
        fullWidth && "w-full"
      )}
    >
      <input
        {...props}
        id={id || defaultId}
        className={cn(inputVariants({ size }), className)}
        type={isPassword && !isPasswordVisible ? "password" : "text"}
      />
      {children}
      {isPassword && (
        <IconButton
          onClick={toggle}
          className="absolute top-0 bottom-0 right-0 p-4 rounded-none"
          type="button"
        >
          {isPasswordVisible ? <MdVisibilityOff /> : <MdVisibility />}
        </IconButton>
      )}
    </div>
  );
}

export default Input;
