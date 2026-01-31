import { cn } from "@/lib/cn";
import { VariantProps } from "class-variance-authority";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "./Button";

export type ButtonProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & {
    icon?: React.ReactNode;
  };

function ButtonLink({
  icon,
  variant,
  size,
  fullWidth,
  center,
  className,
  ...props
}: ButtonProps) {
  if (icon) {
    return (
      <Link
        className={cn(
          buttonVariants({ variant, size, fullWidth, center }),
          className,
          "-pl-4"
        )}
        {...props}
      >
        {" "}
        {icon}
        <span className="hidden sm:inline">{props.children}</span>
      </Link>
    );
  }
  return (
    <Link
      className={cn(
        buttonVariants({ variant, size, fullWidth, center }),
        className
      )}
      {...props}
    />
  );
}

export default ButtonLink;
