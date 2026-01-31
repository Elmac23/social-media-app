import { cn } from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const typographyVariants = cva("font-sans", {
  variants: {
    bold: {
      true: "font-bold",
    },
    center: {
      true: "text-center",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
    color: {
      primary: "text-foreground",
      muted: "text-muted",
      danger: "text-red-500",
      success: "text-green-500",
      warning: "text-yellow-500",
    },
  },
  defaultVariants: {
    size: "md",
    color: "primary",
    // bold: false,
  },
});
export type TypographyProps = {
  as?: React.ElementType;
} & React.ComponentProps<"div"> &
  VariantProps<typeof typographyVariants>;

function Typography({
  size,
  color,
  center,
  bold,
  as = "p",
  className,
  ...props
}: TypographyProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        typographyVariants({ size, color, bold, center }),
        className,
      )}
      {...props}
    />
  );
}

export default Typography;
