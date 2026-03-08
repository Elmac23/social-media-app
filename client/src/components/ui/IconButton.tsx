import { cn } from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const buttonVariants = cva(
  "rounded-full font-medium cursor-pointer transition-colors text-center flex items-center",
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
          "text-foreground hover:text-primary hover:bg-background/90 hover:text-primary-500",
      },
      size: {
        small: "text-xs h-8",
        medium: "text-base h-8",
        large: "text-lg h-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  },
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
        "aspect-square grid place-items-center text-center",
        className,
      )}
      {...props}
    />
  );
}

export default IconButton;
