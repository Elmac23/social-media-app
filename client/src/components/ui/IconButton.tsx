import { cn } from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const buttonVariants = cva(
  "p-2 rounded-full font-medium cursor-pointer transition-colors text-center flex items-center gap-2",
  {
    variants: {
      center: {
        true: "justify-center",
      },
      fullWidth: {
        true: "grow",
      },
      variant: {
        primary: "bg-primary-500 text-primary-foreground hover:bg-primary-900",
        secondary: "bg-background/80 hover:bg-background",
        outline:
          "border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-primary-foreground transition-colors",
        ghost:
          "text-primary-foreground hover:text-primary hover:bg-background/90 hover:text-primary-500",
      },
      size: {
        small: "text-xs",
        medium: "text-base",
        large: "text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    icon?: React.ReactNode;
  };

function IconButton({
  variant,
  size,
  fullWidth,
  center,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size, fullWidth, center }),
        className
      )}
      {...props}
    />
  );
}

export default IconButton;
