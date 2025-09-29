import { cn } from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const cardVariants = cva(
  "bg-background-lighter shadow-lg border-1 border-primary-foreground/10 p-4 rounded-lg",
  {
    variants: {},
    defaultVariants: {},
  }
);

export type CardProps = React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants>;

function Card({ className, ...props }: CardProps) {
  return <div className={cn(cardVariants(), className)} {...props} />;
}

export default Card;
