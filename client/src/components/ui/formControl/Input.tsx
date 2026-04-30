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

const inputOutlineVariants = cva(
  "ring-2 inline-block relative rounded-sm transition-all",
  {
    variants: {
      color: {
        primary:
          "ring-primary-900 bg-background-lighter focus-within:ring-primary-400 hover:ring-primary-400",
        default:
          "ring-border bg-background-lighter focus-within:ring-primary-400 hover:ring-primary-400",
      },
    },
    defaultVariants: {
      color: "default",
    },
  },
);

type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  fullWidth?: boolean;
  borderClassName?: string;
} & VariantProps<typeof inputVariants> &
  VariantProps<typeof inputOutlineVariants>;

function Input({
  size,
  fullWidth,
  className,
  children,
  borderClassName,
  color,
  ...props
}: InputProps) {
  const { id } = useFormControl();
  const defaultId = useId();
  const isPassword = props.type === "password";
  const { value: isPasswordVisible, toggle } = useToggle(false);
  return (
    <div
      className={cn(
        inputOutlineVariants({ color }),
        borderClassName,
        fullWidth && "w-full",
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
          variant="ghost"
          className="absolute top-0 bottom-0 right-0 w-12 rounded-none h-full grid place-items-center"
          type="button"
        >
          {isPasswordVisible ? <MdVisibilityOff /> : <MdVisibility />}
        </IconButton>
      )}
    </div>
  );
}

export default Input;
