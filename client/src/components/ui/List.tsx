import { cn } from "@/lib/cn";
import React from "react";

type ListProps = React.PropsWithChildren<{
  variant: "ol" | "ul";
  className?: string;
}>;

function List({ variant, children, className }: ListProps) {
  const styles = cn(
    "bg-background  divide-y-2 divide-background-lighter",
    className,
  );
  if (variant === "ol") return <ol className={styles}>{children}</ol>;

  return <ul className={styles}>{children}</ul>;
}

export default List;
