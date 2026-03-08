import React from "react";
import { cn } from "@/lib/cn";
import Typography from "../Typography";

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return <table className={cn("w-full mb-4", className)} {...props} />;
}

export function Tr({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr className={cn(className)} {...props} />;
}

export function Td({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn("py-2 px-4 border-1 border-background", className)}
      {...props}
    />
  );
}

export function THeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return <thead className={cn("bg-background", className)} {...props} />;
}

export function TBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={cn(className)} {...props} />;
}

export function Th({ className, ...props }: React.ComponentProps<"th">) {
  return <th className={cn("p-2 text-center", className)} {...props} />;
}

export function TableDescription(
  props: React.ComponentProps<typeof Typography>,
) {
  return <Typography color="muted" size="sm" {...props} />;
}
